"use client"

import type React from "react"
import { useMemo, useState } from "react"
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Music2,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SiteContent } from "@/lib/site-content/schema"
import { normalizeExternalUrl } from "@/lib/url"

export function ContactMain({ contact }: { contact: SiteContent["contact"] }) {
  const { language, t } = useLanguage()
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const socialIcons = {
    linkedin: Linkedin,
    instagram: Instagram,
    facebook: Facebook,
    x: Twitter,
    youtube: Youtube,
    tiktok: Music2,
  } as const

  const socialLinks = useMemo(() => {
    return (contact.socials || [])
      .map((s) => ({ ...s, url: s.url?.trim() ?? "" }))
      .filter((s) => s.url)
  }, [contact.socials])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formEl = e.currentTarget as HTMLFormElement
    const formData = new FormData(formEl)
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      company: String(formData.get("company") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""), // honeypot
    }

    setStatus("submitting")
    setErrorMessage(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const fallback = language === "en" ? "Could not send. Please try again." : "تعذر الإرسال. حاول مرة أخرى."
        try {
          const json = (await res.json()) as { error?: string }
          throw new Error(json.error || fallback)
        } catch {
          throw new Error(fallback)
        }
      }

      setStatus("success")
      formEl.reset()
      setTimeout(() => setStatus("idle"), 5000)
    } catch (err: unknown) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : null)
    }
  }

  const contactInfo = [
    { icon: MapPin, label: t.contact.info.address, value: contact.address[language] },
    { icon: Phone, label: t.contact.info.phone, value: contact.phone },
    { icon: Mail, label: t.contact.info.email, value: contact.email },
    { icon: Clock, label: t.contact.info.hours, value: contact.hours[language] },
  ]

  return (
    <>
      {/* Contact Info Bar */}
      <section className="py-12 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((item, index) => (
              <AnimatedSection key={index} animation="reveal-up" delay={index * 100}>
                <div className="flex items-start gap-4">
                  <item.icon className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {socialLinks.length > 0 && (
            <AnimatedSection animation="reveal-up" delay={300} className="mt-10 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.type]
                const href = normalizeExternalUrl(social.url)
                return (
                  <a
                    key={social.id}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center border border-border/60 hover:bg-muted transition-colors"
                    aria-label={social.type}
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </a>
                )
              })}
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Form */}
            <AnimatedSection animation="reveal-up">
              <div>
                <h2 className="font-serif text-3xl lg:text-4xl mb-8">
                  {language === "en" ? "Send us a message" : "أرسل لنا رسالة"}
                </h2>

                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full border border-foreground/20 flex items-center justify-center mb-6">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <p className="font-serif text-2xl mb-2">{t.contact.form.success}</p>
                    <p className="text-muted-foreground">{language === "en" ? "We'll be in touch soon." : "سنتواصل معك قريبًا."}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs tracking-[0.15em] uppercase">
                          {t.contact.form.name}
                        </Label>
                        <Input id="name" name="name" required className="rounded-none h-12 border-foreground/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs tracking-[0.15em] uppercase">
                          {t.contact.form.email}
                        </Label>
                        <Input id="email" name="email" type="email" required className="rounded-none h-12 border-foreground/20" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs tracking-[0.15em] uppercase">
                          {t.contact.form.phone}
                        </Label>
                        <Input id="phone" name="phone" type="tel" className="rounded-none h-12 border-foreground/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-xs tracking-[0.15em] uppercase">
                          {t.contact.form.company}
                        </Label>
                        <Input id="company" name="company" className="rounded-none h-12 border-foreground/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-xs tracking-[0.15em] uppercase">
                        {t.contact.form.subject}
                      </Label>
                      <Input id="subject" name="subject" required className="rounded-none h-12 border-foreground/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-xs tracking-[0.15em] uppercase">
                        {t.contact.form.message}
                      </Label>
                      <Textarea id="message" name="message" rows={6} required className="rounded-none border-foreground/20 resize-none" />
                    </div>

                    {/* Honeypot */}
                    <input tabIndex={-1} autoComplete="off" name="website" className="hidden" aria-hidden="true" />

                    {status === "error" && (
                      <p className="text-sm text-destructive">
                        {errorMessage ||
                          (language === "en" ? "Could not send. Please try again." : "تعذر الإرسال. حاول مرة أخرى.")}
                      </p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-none px-8 h-14 w-full sm:w-auto"
                      disabled={status === "submitting"}
                    >
                      {status === "submitting" ? (language === "en" ? "Sending…" : "جارٍ الإرسال…") : t.contact.form.submit}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Map */}
            <AnimatedSection animation="reveal-up" delay={200}>
              <div className="h-full min-h-[500px] lg:min-h-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111422.92888865825!2d47.91620599999999!3d29.3759163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9c6c0b7f8507%3A0x8a9a0f2b0c8f0f0f!2sKuwait%20City%2C%20Kuwait!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "500px", filter: "grayscale(100%)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="National Orascom Location"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
