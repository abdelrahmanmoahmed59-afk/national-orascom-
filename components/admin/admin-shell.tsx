"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Globe, LogOut, Moon, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/language-context"
import { useTheme } from "@/lib/theme-context"
import { cn } from "@/lib/utils"
import type { SiteContent } from "@/lib/site-content/schema"

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/table-projects", label: "Table Projects" },
  { href: "/admin/careers", label: "Careers" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/policies", label: "Policies" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
]

export function AdminShell({
  children,
  branding,
  username,
}: {
  children: ReactNode
  branding?: SiteContent["branding"]
  username?: string | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { dir, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null)
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div dir={dir} className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/admin" className="group flex items-center gap-3 min-w-0">
            <span className="inline-flex h-11 w-11 items-center justify-center border border-border/60 bg-background/60 backdrop-blur overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={branding?.logo.src ?? "/placeholder-logo.svg"} alt={branding?.logo.alt?.[language] ?? "Logo"} className="h-8 w-8 object-contain" />
            </span>
            <div className="leading-tight min-w-0">
              <div className="font-serif text-lg tracking-tight truncate">
                {branding?.companyName?.[language] ?? "Admin Dashboard"}
              </div>
              <div className="hidden sm:block text-[10px] tracking-[0.25em] uppercase text-muted-foreground truncate">
                {branding?.tagline?.[language] ?? (language === "en" ? "Content Management" : "إدارة المحتوى")}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {username && (
              <div className="flex items-center gap-2 px-3 h-10 border border-border/60 bg-background/60 backdrop-blur max-w-[180px]">
                <User className="hidden sm:block h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate max-w-[160px]">{username}</span>
              </div>
            )}

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full w-10 h-10">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Switch language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="min-w-[120px]">
                <DropdownMenuItem onClick={() => setLanguage("en")} className="cursor-pointer">
                  <span className={language === "en" ? "font-semibold" : ""}>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")} className="cursor-pointer">
                  <span className={language === "ar" ? "font-semibold" : ""}>العربية</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="rounded-none h-10 ml-1" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              {language === "en" ? "Logout" : "تسجيل الخروج"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-4 h-11 leading-[44px] border border-border/60 hover:bg-muted transition-colors",
                  pathname === item.href && "bg-muted font-medium",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  )
}
