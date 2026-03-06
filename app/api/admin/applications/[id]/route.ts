import { NextResponse } from "next/server"
import { isSameOrigin } from "@/lib/auth/origin"
import { deleteApplication } from "@/lib/applications/store"

export async function DELETE(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }

  const resolved = await params
  await deleteApplication(resolved.id)
  const response = NextResponse.json({ ok: true })
  response.headers.set("Cache-Control", "no-store")
  return response
}

