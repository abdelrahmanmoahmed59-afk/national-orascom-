"use client"

import { BadgeCheck, Building2, Users } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { useCountUp } from "@/lib/animation-system"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SiteContent } from "@/lib/site-content/schema"

type AboutContent = SiteContent["about"]
type AboutStat = SiteContent["aboutStats"][number]
type AboutValue = SiteContent["aboutValues"][number]
type AboutCoreValues = SiteContent["aboutCoreValues"]
type AboutMilestone = SiteContent["aboutMilestones"][number]

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { ref, count } = useCountUp(value, { duration: 2400 })
  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

export default function AboutClient({
  content,
  stats,
  values,
  coreValues,
  milestones,
}: {
  content: AboutContent
  stats: AboutStat[]
  values: AboutValue[]
  coreValues: AboutCoreValues
  milestones: AboutMilestone[]
}) {
  const { language, dir } = useLanguage()
  const hasValuesContent = values.length > 0 || coreValues.items.length > 0
  const valuesEyebrow = language === "en" ? "Values Framework" : "منهج القيم"
  const valuesLead =
    language === "en"
      ? "The standards we hold internally shape how we plan, communicate, and deliver every project."
      : "المعايير التي نلتزم بها داخلياً هي التي توجه طريقة التخطيط والتواصل وتنفيذ كل مشروع."

  return (
    <div dir={dir} className="overflow-hidden">
      <section className="flex min-h-[70vh] items-end pt-32 pb-20 lg:pb-32">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <AnimatedSection animation="reveal-up">
              <p className="mb-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">
                {language === "en" ? "About National Orascom" : "عن ناشونال أوراسكوم"}
              </p>
              <h1 className="font-serif text-5xl leading-[0.95] lg:text-6xl xl:text-7xl">
                {language === "en" ? (
                  <>
                    Built for
                    <br />
                    <span className="italic font-normal">delivery</span>
                  </>
                ) : (
                  <>
                    مصممة
                    <br />
                    <span className="italic font-normal">للتنفيذ</span>
                  </>
                )}
              </h1>
            </AnimatedSection>

            <AnimatedSection animation="reveal-up" delay={200} className="lg:pt-16">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {language === "en" ? content.excerptEn || content.contentEn : content.excerptAr || content.contentAr}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection animation="mask-up">
            <div className="aspect-21/9 overflow-hidden border border-border/60">
              <img
                src={content.imageUrl || "/modern-corporate-building-kuwait-premium-architect.jpg"}
                alt={language === "en" ? "National Orascom" : "ناشونال أوراسكوم"}
                className="h-full w-full object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="border-t border-border py-24 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="mb-16">
            <div className="max-w-3xl">
              <p className="mb-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">
                {language === "en" ? "Our Story" : "قصتنا"}
              </p>
              <h2 className="mb-8 font-serif text-4xl leading-tight lg:text-5xl">
                {language === "en" ? content.titleEn : content.titleAr}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {language === "en" ? content.contentEn : content.contentAr}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
            <AnimatedSection animation="reveal-up" delay={100}>
              <div className="border border-border/50 bg-background/5 p-8 transition-colors hover:bg-background/10">
                <Building2 className="mb-6 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-4 font-serif text-2xl">{language === "en" ? "Sector Focus" : "القطاعات"}</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {language === "en" ? content.industryEn : content.industryAr}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="reveal-up" delay={200}>
              <div className="border border-border/50 bg-background/5 p-8 transition-colors hover:bg-background/10">
                <Users className="mb-6 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-4 font-serif text-2xl">
                  {language === "en" ? "Client-First Delivery" : "تنفيذ يركز على العميل"}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {language === "en" ? content.customerEn : content.customerAr}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="border-y border-border py-24 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} animation="reveal-up" delay={index * 100}>
                <div className="text-center lg:text-left">
                  <p className="mb-2 font-serif text-5xl lg:text-6xl xl:text-7xl">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm tracking-wide text-muted-foreground">
                    {language === "en" ? stat.labelEn : stat.labelAr}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {hasValuesContent && (
        <section className="border-t border-border py-24 lg:py-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection animation="reveal-up" className="mb-16 lg:mb-20">
              <div className="max-w-3xl space-y-6">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                    <BadgeCheck className="h-5 w-5 text-sky-600" />
                  </span>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{valuesEyebrow}</p>
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl">
                  {language === "en" ? coreValues.titleEn : coreValues.titleAr}
                </h2>
                <p className="text-base leading-8 text-muted-foreground lg:text-lg">{valuesLead}</p>
              </div>
            </AnimatedSection>

            {values.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {values.map((value, index) => (
                  <AnimatedSection key={`${language}-${index}`} animation="reveal-up" delay={index * 80}>
                    <article className="flex h-full flex-col rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-[0_24px_55px_rgba(15,23,42,0.05)]">
                      <div className="mb-5 flex items-center justify-between gap-4">
                        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-border/70 bg-background px-3 text-xs font-mono tracking-[0.18em] text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                          {language === "en" ? "Principle" : "مبدأ"}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl leading-tight text-foreground">
                        {language === "en" ? value.titleEn : value.titleAr}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        {language === "en" ? value.descEn : value.descAr}
                      </p>
                    </article>
                  </AnimatedSection>
                ))}
              </div>
            )}

            {coreValues.items.length > 0 && (
              <div className={`${values.length > 0 ? "mt-12 border-t border-border/60 pt-12" : ""} grid gap-6 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 lg:gap-8`}>
                {coreValues.items.map((value, index) => {
                  const label = language === "en" ? value.labelEn : value.labelAr || value.labelEn
                  const statement = language === "en" ? value.statementEn : value.statementAr || value.statementEn
                  const intro = language === "en" ? value.introEn : value.introAr || value.introEn
                  const points =
                    language === "en" ? value.pointsEn : value.pointsAr.length > 0 ? value.pointsAr : value.pointsEn

                  return (
                    <AnimatedSection key={value.id} animation="reveal-up" delay={index * 100}>
                      <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-[0_24px_60px_rgba(15,23,42,0.07)]">
                        <div className="overflow-hidden border-b border-border/60 bg-background/40">
                          <img src={value.imageUrl} alt={label} className="h-52 w-full object-cover lg:h-48 2xl:h-52" />
                        </div>

                        <div className="flex flex-1 flex-col p-5 lg:p-6">
                          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
                          <h3 className="mt-3 text-xl font-semibold leading-snug text-foreground">{statement}</h3>
                          <p className="mt-3 text-sm leading-6 text-sky-700/90">{intro}</p>
                          <div className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                            {points.map((point, pointIndex) => (
                              <div key={`${value.id}-${pointIndex}`} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                                <p>{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </article>
                    </AnimatedSection>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="border-t border-border py-24 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="mb-16 lg:mb-24">
            <p className="mb-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {language === "en" ? "Milestones" : "محطات"}
            </p>
            <h2 className="max-w-2xl font-serif text-4xl lg:text-5xl">
              {language === "en" ? "How we’ve grown" : "كيف تطورنا"}
            </h2>
          </AnimatedSection>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((milestone, index) => (
              <AnimatedSection key={index} animation="reveal-up" delay={index * 100}>
                <div className="border-t border-border pt-8">
                  <p className="mb-4 font-serif text-4xl lg:text-5xl">{milestone.year}</p>
                  <p className="text-muted-foreground">{language === "en" ? milestone.titleEn : milestone.titleAr}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-24 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <AnimatedSection animation="reveal-up">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  {language === "en" ? "Our Mission" : "مهمتنا"}
                </p>
                <h2 className="font-serif text-lg leading-8 lg:text-xl">
                  {language === "en" ? content.missionEn : content.missionAr}
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="reveal-up" delay={200}>
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  {language === "en" ? "Our Vision" : "رؤيتنا"}
                </p>
                <h2 className="font-serif text-lg leading-8 lg:text-xl">
                  {language === "en" ? content.visionEn : content.visionAr}
                </h2>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
