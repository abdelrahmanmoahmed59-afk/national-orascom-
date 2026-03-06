import { NextResponse } from "next/server"
import { readSiteContent, writeSiteContent } from "@/lib/site-content/store"
import { isSameOrigin } from "@/lib/auth/origin"

export async function GET() {
  const content = await readSiteContent()
  const response = NextResponse.json(content)
  response.headers.set("Cache-Control", "no-store")
  return response
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  try {
    const saved = await writeSiteContent(body)
    const response = NextResponse.json(saved)
    response.headers.set("Cache-Control", "no-store")
    return response
  } catch (err) {
    return NextResponse.json({ error: "Invalid content format" }, { status: 400 })
  }
}

