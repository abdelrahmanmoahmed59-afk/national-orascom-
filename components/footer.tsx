"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, Facebook, Instagram, Linkedin, Music2, Twitter, Youtube } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SiteContent } from "@/lib/site-content/schema"
import { normalizeExternalUrl } from "@/lib/url"

export function Footer({
  branding,
  contact,
}: {
  branding: SiteContent["branding"]
  contact: SiteContent["contact"]
}) {
  const { language, t, dir } = useLanguage()
  const currentYear = new Date().getFullYear()
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [subscribeMessage, setSubscribeMessage] = useState<string | null>(null)

  const socialIcons = {
    linkedin: Linkedin,
    instagram: Instagram,
    facebook: Facebook,
    x: Twitter,
    youtube: Youtube,
    tiktok: Music2,
  } as const

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/projects", label: t.nav.projects },
    { href: "/clients", label: t.nav.clients },
    { href: "/careers", label: t.nav.careers },
    { href: "/contact", label: t.nav.contact },
    { href: "/policies", label: t.nav.policies },
  ]

  async function subscribe(e: FormEvent) {
    e.preventDefault()
    const formEl = e.currentTarget as HTMLFormElement
    const formData = new FormData(formEl)
    const payload = {
      email: String(formData.get("email") ?? ""),
      website: String(formData.get("website") ?? ""), // honeypot
    }

    setSubscribeStatus("submitting")
    setSubscribeMessage(null)

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        setSubscribeStatus("error")
        setSubscribeMessage(language === "en" ? "Could not subscribe. Please try again." : "تعذر الاشتراك. حاول مرة أخرى.")
        return
      }

      setSubscribeStatus("success")
      setSubscribeMessage(language === "en" ? "Subscribed successfully." : "تم الاشتراك بنجاح.")
      formEl.reset()
      setTimeout(() => {
        setSubscribeStatus("idle")
        setSubscribeMessage(null)
      }, 5000)
    } catch {
      setSubscribeStatus("error")
      setSubscribeMessage(language === "en" ? "Could not subscribe. Please try again." : "تعذر الاشتراك. حاول مرة أخرى.")
    }
  }

  return (
    <footer dir={dir} className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center border border-background/20 bg-background/5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={branding.logo.src} alt={branding.logo.alt[language]} className="h-7 w-7 object-contain" />
              </span>
              <div className="leading-tight">
                <div className="font-serif text-xl tracking-tight text-background">{branding.companyName[language]}</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-background/60">
                  {branding.tagline[language]}
                </div>
              </div>
            </Link>
            <p className="text-background/60 leading-relaxed max-w-sm">
              {language === "en"
                ? "Construction and contracting services delivered with safety, quality, and reliable execution."
                : "خدمات البناء والمقاولات مع التركيز على السلامة والجودة والتنفيذ الموثوق."}
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-xs tracking-[0.2em] uppercase mb-6 opacity-60">
              {language === "en" ? "Navigation" : "التنقل"}
            </h3>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/60 hover:text-background transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs tracking-[0.2em] uppercase mb-6 opacity-60">
              {language === "en" ? "Contact" : "التواصل"}
            </h3>
            <ul className="space-y-4 text-sm text-background/60">
              <li>
                <p className="whitespace-pre-line">{contact.address[language]}</p>
              </li>
              <li>
                <a href={`tel:${contact.phone}`} className="hover:text-background transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-background transition-colors">
                  {contact.email}
                </a>
              </li>
            </ul>

            {contact.socials?.some((s) => s.url?.trim()) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {contact.socials
                  .map((s) => ({ ...s, url: s.url?.trim() ?? "" }))
                  .filter((s) => s.url)
                  .map((social) => {
                    const Icon = socialIcons[social.type]
                    const href = normalizeExternalUrl(social.url)
                    return (
                      <a
                        key={social.id}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center border border-background/20 bg-background/5 hover:bg-background/10 transition-colors"
                        aria-label={social.type}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    )
                  })}
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-xs tracking-[0.2em] uppercase mb-6 opacity-60">
              {language === "en" ? "Stay Updated" : "ابقَ على اطلاع"}
            </h3>
            <p className="text-sm text-background/60 mb-4">
              {language === "en"
                ? "Subscribe for project updates and company news."
                : "اشترك للحصول على تحديثات المشاريع وأخبار الشركة."}
            </p>
            <form className="flex" onSubmit={subscribe}>
              <Input
                type="email"
                name="email"
                required
                disabled={subscribeStatus === "submitting"}
                placeholder={language === "en" ? "Your email" : "بريدك الإلكتروني"}
                className="rounded-none bg-transparent border-background/20 text-background placeholder:text-background/40 focus-visible:ring-background/50"
              />
              {/* Honeypot */}
              <input tabIndex={-1} autoComplete="off" name="website" className="hidden" aria-hidden="true" />
              <Button
                type="submit"
                size="icon"
                className="rounded-none bg-background text-foreground hover:bg-background/90 shrink-0"
                disabled={subscribeStatus === "submitting"}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {subscribeMessage && (
              <p className="text-xs text-background/60 mt-3" aria-live="polite">
                {subscribeMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-background/40">© {currentYear} National Orascom. {t.footer.rights}</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs text-background/40 hover:text-background/60 transition-colors">
                {t.footer.privacy}
              </Link>
              <Link href="/terms" className="text-xs text-background/40 hover:text-background/60 transition-colors">
                {t.footer.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
