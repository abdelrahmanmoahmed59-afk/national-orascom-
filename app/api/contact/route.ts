import { NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { isSameOrigin } from "@/lib/auth/origin"
import { appendContactSubmission } from "@/lib/contact-submissions/store"

const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(320),
  phone: z.string().trim().max(50).optional(),
  company: z.string().trim().max(200).optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(5).max(5000),
  website: z.string().optional(), // honeypot
})

function getSourcePath(request: Request) {
  const referer = request.headers.get("referer")
  if (!referer) return undefined
  try {
    const url = new URL(referer)
    return url.pathname
  } catch {
    return undefined
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  // Honeypot: if filled, pretend success.
  if (parsed.data.website && parsed.data.website.trim()) {
    return NextResponse.json({ ok: true })
  }

  await appendContactSubmission({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: parsed.data.name.trim(),
    email: parsed.data.email.trim(),
    phone: parsed.data.phone?.trim() || undefined,
    company: parsed.data.company?.trim() || undefined,
    subject: parsed.data.subject.trim(),
    message: parsed.data.message.trim(),
    sourcePath: getSourcePath(request),
  })

  const response = NextResponse.json({ ok: true })
  response.headers.set("Cache-Control", "no-store")
  return response
}

