import { NextResponse } from "next/server"
import { z } from "zod"
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants"
import { isSameOrigin } from "@/lib/auth/origin"
import { verifyPassword } from "@/lib/auth/password"
import { createAdminSessionToken } from "@/lib/auth/session"

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }

  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH
  const authSecret = process.env.AUTH_SECRET

  if (!expectedUsername || !expectedPasswordHash || !authSecret) {
    return NextResponse.json({ error: "Server auth is not configured" }, { status: 500 })
  }

  const [algorithm, saltB64, keyB64, ...rest] = expectedPasswordHash.split("$")
  const hashLooksValid = algorithm === "scrypt" && !!saltB64 && !!keyB64 && rest.length === 0
  if (!hashLooksValid) {
    return NextResponse.json({ error: "Server auth is misconfigured" }, { status: 500 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { username, password } = parsed.data
  const valid = username === expectedUsername && verifyPassword(password, expectedPasswordHash)

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = await createAdminSessionToken({ username })
  const response = NextResponse.json({ ok: true })

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  response.headers.set("Cache-Control", "no-store")

  return response
}
