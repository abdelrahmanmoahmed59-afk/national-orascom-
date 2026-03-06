import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants"
import { isSameOrigin } from "@/lib/auth/origin"

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}

