import { NextResponse } from "next/server"
import { isSameOrigin } from "@/lib/auth/origin"
import { clearApplications, readApplications } from "@/lib/applications/store"

export async function GET() {
  const applications = await readApplications()
  const response = NextResponse.json(applications)
  response.headers.set("Cache-Control", "no-store")
  return response
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }

  await clearApplications()
  const response = NextResponse.json({ ok: true })
  response.headers.set("Cache-Control", "no-store")
  return response
}

