import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants"
import { verifyAdminSessionToken } from "@/lib/auth/session"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isAdminPage = pathname.startsWith("/admin")
  const isAdminApi = pathname.startsWith("/api/admin")
  const isLoginPage = pathname === "/admin/login"
  const isLoginApi = pathname === "/api/admin/login"

  if ((isAdminPage || isAdminApi) && !isLoginPage && !isLoginApi) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
    const session = token ? await verifyAdminSessionToken(token) : null

    if (!session) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}

