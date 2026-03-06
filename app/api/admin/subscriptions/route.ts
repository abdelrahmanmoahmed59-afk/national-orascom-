import { NextResponse } from "next/server"
import { isSameOrigin } from "@/lib/auth/origin"
import { clearNewsletterSubscriptions, readNewsletterSubscriptions } from "@/lib/newsletter-subscriptions/store"

export async function GET() {
  const subscriptions = await readNewsletterSubscriptions()
  const response = NextResponse.json(subscriptions)
  response.headers.set("Cache-Control", "no-store")
  return response
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }

  await clearNewsletterSubscriptions()
  const response = NextResponse.json({ ok: true })
  response.headers.set("Cache-Control", "no-store")
  return response
}

