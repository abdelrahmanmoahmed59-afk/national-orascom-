import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { unstable_noStore as noStore } from "next/cache"
import { AdminShell } from "@/components/admin/admin-shell"
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants"
import { verifyAdminSessionToken } from "@/lib/auth/session"
import { readSiteContent } from "@/lib/site-content/store"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  noStore()
  const siteContent = await readSiteContent()

  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value
  const session = token ? await verifyAdminSessionToken(token) : null

  return (
    <AdminShell branding={siteContent.branding} username={session?.username}>
      {children}
    </AdminShell>
  )
}
