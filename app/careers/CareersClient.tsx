"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Mail } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { AnimatedSection } from "@/components/animated-section"
import type { JobOpeningItem } from "@/lib/site-content/schema"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CareersClient({
  openings,
  applyEmail,
}: {
  openings: JobOpeningItem[]
  applyEmail: string
}) {
  const { language, dir } = useLanguage()
  const [applyOpen, setApplyOpen] = useState(false)
  const [selectedJobSlug, setSelectedJobSlug] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const selectedJob = useMemo(
    () => openings.find((o) => o.slug === selectedJobSlug) || null,
    [openings, selectedJobSlug],
  )

  const labels = useMemo(
    () => ({
      apply: language === "en" ? "Apply" : "قدّم الآن",
      applyTitle: language === "en" ? "Apply for this role" : "التقديم على الوظيفة",
      applyDesc:
        language === "en"
          ? "Fill in your details and we’ll review your application."
          : "أدخل بياناتك وسنراجع طلبك.",
      position: language === "en" ? "Position" : "الوظيفة",
      name: language === "en" ? "Full Name" : "الاسم الكامل",
      email: language === "en" ? "Email Address" : "البريد الإلكتروني",
      phone: language === "en" ? "Phone Number" : "رقم الهاتف",
      submit: language === "en" ? "Submit application" : "إرسال الطلب",
      submitting: language === "en" ? "Submitting…" : "جارٍ الإرسال…",
      success: language === "en" ? "Application sent successfully." : "تم إرسال طلبك بنجاح.",
      error: language === "en" ? "Could not submit. Please try again." : "تعذر الإرسال. حاول مرة أخرى.",
    }),
    [language],
  )

  async function submitApplication() {
    if (!selectedJob) return
    setSubmitting(true)
    setSubmitMessage(null)
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobSlug: selectedJob.slug,
          name: form.name,
          email: form.email,
          phone: form.phone,
          website: form.website,
        }),
      })
      if (!res.ok) throw new Error("failed")
      setSubmitMessage(labels.success)
      setForm({ name: "", email: "", phone: "", website: "" })
    } catch {
      setSubmitMessage(labels.error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div dir={dir} className="overflow-hidden">
      {/* Hero */}
      <section className="min-h-[50vh] flex items-end pt-32 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <AnimatedSection animation="reveal-up">
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                {language === "en" ? "Join the Team" : "انضم إلى الفريق"}
              </p>
            </AnimatedSection>
            <AnimatedSection animation="reveal-up" delay={100}>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl leading-[0.95]">
                {language === "en" ? (
                  <>
                    Careers at
                    <br />
                    <span className="italic font-normal">National Orascom</span>
                  </>
                ) : (
                  <>
                    الوظائف في
                    <br />
                    <span className="italic font-normal">ناشونال أوراسكوم</span>
                  </>
                )}
              </h1>
            </AnimatedSection>
            <AnimatedSection animation="reveal-up" delay={200}>
              <p className="text-lg text-muted-foreground leading-relaxed mt-8">
                {language === "en"
                  ? "We’re building teams that deliver. If you care about safety, quality, and reliable execution, we’d like to hear from you."
                  : "نحن نبني فرقاً تُنجز. إذا كانت السلامة والجودة والتنفيذ الموثوق مهمين لك، يسعدنا تواصلك معنا."}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="mb-10 lg:mb-14">
            <h2 className="font-serif text-3xl lg:text-4xl">
              {language === "en" ? "Open Positions" : "الوظائف المتاحة"}
            </h2>
            <p className="text-muted-foreground mt-3">
              {language === "en"
                ? "Open a role to view responsibilities and requirements."
                : "افتح الوظيفة لعرض المسؤوليات والمتطلبات."}
            </p>
          </AnimatedSection>

          <div className="space-y-4">
            {openings.map((job, index) => (
              <AnimatedSection key={job.slug} animation="reveal-up" delay={Math.min(index * 75, 300)}>
                <details id={job.slug} className="group border border-border/60 bg-background/50 hover:bg-background/70 transition-colors">
                  <summary className="cursor-pointer list-none p-6 lg:p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                          {language === "en" ? job.typeEn : job.typeAr} • {language === "en" ? job.locationEn : job.locationAr}
                        </p>
                        <h3 className="font-serif text-2xl lg:text-3xl mt-2">
                          {language === "en" ? job.titleEn : job.titleAr}
                        </h3>
                      </div>
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
                    </div>
                  </summary>

                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <p className="text-muted-foreground leading-relaxed">
                      {language === "en" ? job.summaryEn : job.summaryAr}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        className="rounded-none h-12 px-6"
                        onClick={() => {
                          setSelectedJobSlug(job.slug)
                          setApplyOpen(true)
                          setSubmitMessage(null)
                        }}
                      >
                        {labels.apply}
                      </Button>
                      <a
                        href={`mailto:${applyEmail}?subject=${encodeURIComponent(
                          `${language === "en" ? "Job application" : "طلب توظيف"}: ${language === "en" ? job.titleEn : job.titleAr}`,
                        )}`}
                        className="inline-flex items-center justify-center border border-border px-5 h-12 hover:bg-muted transition-colors"
                      >
                        {language === "en" ? "Apply by email" : "التقديم عبر البريد"}
                      </a>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 mt-8">
                      <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                          {language === "en" ? "Responsibilities" : "المسؤوليات"}
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2 list-disc ps-5">
                          {(language === "en" ? job.responsibilitiesEn : job.responsibilitiesAr).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                          {language === "en" ? "Requirements" : "المتطلبات"}
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2 list-disc ps-5">
                          {(language === "en" ? job.requirementsEn : job.requirementsAr).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </details>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="reveal-up" delay={200} className="mt-14 border-t border-border pt-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  {language === "en" ? "How to apply" : "طريقة التقديم"}
                </p>
                <p className="mt-3 text-muted-foreground">
                  {language === "en"
                    ? "Send your CV and role name to:"
                    : "أرسل سيرتك الذاتية واسم الوظيفة إلى:"}
                </p>
              </div>
              <a
                href={`mailto:${applyEmail}`}
                className="inline-flex items-center gap-2 border border-border px-4 h-12 hover:bg-muted transition-colors"
              >
                <Mail className="h-4 w-4" />
                {applyEmail}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent dir={dir} className="rounded-none sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-serif">{labels.applyTitle}</DialogTitle>
            <DialogDescription>{labels.applyDesc}</DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs tracking-[0.15em] uppercase">{labels.position}</Label>
                <Input
                  value={language === "en" ? selectedJob.titleEn : selectedJob.titleAr}
                  readOnly
                  className="rounded-none h-12 border-foreground/20"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="apply-name" className="text-xs tracking-[0.15em] uppercase">
                    {labels.name}
                  </Label>
                  <Input
                    id="apply-name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="rounded-none h-12 border-foreground/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apply-phone" className="text-xs tracking-[0.15em] uppercase">
                    {labels.phone}
                  </Label>
                  <Input
                    id="apply-phone"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="rounded-none h-12 border-foreground/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apply-email" className="text-xs tracking-[0.15em] uppercase">
                  {labels.email}
                </Label>
                <Input
                  id="apply-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="rounded-none h-12 border-foreground/20"
                  required
                />
              </div>

              {/* Honeypot */}
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                className="hidden"
                aria-hidden="true"
              />

              {submitMessage && <p className="text-sm text-muted-foreground">{submitMessage}</p>}

              <Button
                type="button"
                className="rounded-none h-12 w-full"
                onClick={submitApplication}
                disabled={submitting}
              >
                {submitting ? labels.submitting : labels.submit}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
