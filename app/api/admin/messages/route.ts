import { NextResponse } from "next/server"
import { isSameOrigin } from "@/lib/auth/origin"
import { clearContactSubmissions, readContactSubmissions } from "@/lib/contact-submissions/store"

export async function GET() {
  const submissions = await readContactSubmissions()
  const response = NextResponse.json(submissions)
  response.headers.set("Cache-Control", "no-store")
  return response
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }

  await clearContactSubmissions()
  const response = NextResponse.json({ ok: true })
  response.headers.set("Cache-Control", "no-store")
  return response
}

