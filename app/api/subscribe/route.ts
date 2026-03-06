import { NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { isSameOrigin } from "@/lib/auth/origin"
import { appendNewsletterSubscription, readNewsletterSubscriptions } from "@/lib/newsletter-subscriptions/store"

const subscribeSchema = z.object({
  email: z.string().email().max(320),
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

  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  // Honeypot: if filled, pretend success.
  if (parsed.data.website && parsed.data.website.trim()) {
    return NextResponse.json({ ok: true })
  }

  const email = parsed.data.email.trim().toLowerCase()
  const existing = await readNewsletterSubscriptions()
  if (existing.some((s) => s.email.trim().toLowerCase() === email)) {
    return NextResponse.json({ ok: true })
  }

  await appendNewsletterSubscription({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    email,
    sourcePath: getSourcePath(request),
  })

  const response = NextResponse.json({ ok: true })
  response.headers.set("Cache-Control", "no-store")
  return response
}

