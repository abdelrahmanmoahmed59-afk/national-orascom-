import type React from "react"
import type { Metadata, Viewport } from "next"
import { Cairo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { ThemeProvider } from "@/lib/theme-context"
import { AnimationProvider } from "@/lib/animation-system"
import { ScrollDirectionProvider } from "@/lib/scroll-direction-context"
import { readSiteContent } from "@/lib/site-content/store"
import { AppChrome } from "@/components/app-chrome"
import "./globals.css"
import { unstable_noStore as noStore } from "next/cache"

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "National Orascom | Construction & Contracting",
  description:
    "National Orascom is a construction and contracting company delivering civil, structural, MEP, and fit-out project packages with safety-first execution.",
  keywords: [
    "construction",
    "contracting",
    "general contracting",
    "civil works",
    "structural works",
    "MEP",
    "fit-out",
    "project management",
    "HSE",
  ],
  generator: "v0.app",
  icons: {
    icon: "/logo%20national%20orascom%20company.png",
    shortcut: "/logo%20national%20orascom%20company.png",
    apple: "/logo%20national%20orascom%20company.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#f5f3ef",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  noStore()
  const siteContent = await readSiteContent()

  return (
    <html lang="en" suppressHydrationWarning className={cairo.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <AnimationProvider>
              <ScrollDirectionProvider>
                <AppChrome branding={siteContent.branding} contact={siteContent.contact} projects={siteContent.projects}>
                  {children}
                </AppChrome>
              </ScrollDirectionProvider>
            </AnimationProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
