import { NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { isSameOrigin } from "@/lib/auth/origin"
import { readSiteContent } from "@/lib/site-content/store"
import { appendApplication } from "@/lib/applications/store"

const applySchema = z.object({
  jobSlug: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  website: z.string().optional(), // honeypot
})

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

  const parsed = applySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  // Honeypot: if filled, pretend success.
  if (parsed.data.website && parsed.data.website.trim()) {
    return NextResponse.json({ ok: true })
  }

  const siteContent = await readSiteContent()
  const job = siteContent.careers.jobs.find((j) => j.slug === parsed.data.jobSlug)
  if (!job) {
    return NextResponse.json({ error: "Unknown job" }, { status: 400 })
  }

  const application = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    jobSlug: job.slug,
    jobTitleEn: job.titleEn,
    jobTitleAr: job.titleAr,
    applicantName: parsed.data.name,
    applicantEmail: parsed.data.email,
    applicantPhone: parsed.data.phone,
  }

  await appendApplication(application)

  const response = NextResponse.json({ ok: true })
  response.headers.set("Cache-Control", "no-store")
  return response
}

