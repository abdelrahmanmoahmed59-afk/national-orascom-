"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { PageLoader } from "@/components/page-loader"
import { PageTransition } from "@/components/page-transition"
import { ScrollProgressBar } from "@/components/scroll-progress-bar"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SmoothScroll } from "@/components/smooth-scroll"
import type { ProjectItem, SiteContent } from "@/lib/site-content/schema"

export function AppChrome({
  branding,
  contact,
  projects,
  children,
}: {
  branding: SiteContent["branding"]
  contact: SiteContent["contact"]
  projects: ProjectItem[]
  children: ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) return <>{children}</>

  return (
    <SmoothScroll>
      <PageLoader branding={branding} />
      <ScrollProgressBar />
      <Navbar branding={branding} projects={projects} />
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer branding={branding} contact={contact} />
      <ScrollToTop />
    </SmoothScroll>
  )
}

