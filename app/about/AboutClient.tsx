"use client"

import { Building2, Users } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { useCountUp } from "@/lib/animation-system"
import { useLanguage } from "@/lib/i18n/language-context"

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { ref, count } = useCountUp(value, { duration: 2400 })
  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

export default function AboutClient({ content, stats, values, milestones }: any) {
  const { language, dir } = useLanguage()

  return (
    <div dir={dir} className="overflow-hidden">
      {/* Hero */}
      <section className="min-h-[70vh] flex items-end pt-32 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <AnimatedSection animation="reveal-up">
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                {language === "en" ? "About National Orascom" : "عن ناشونال أوراسكوم"}
              </p>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl leading-[0.95]">
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
              <p className="text-lg text-muted-foreground leading-relaxed">
                {language === "en" ? content?.excerptEn ?? content?.contentEn : content?.excerptAr ?? content?.contentAr}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="mask-up">
            <div className="aspect-21/9 overflow-hidden border border-border/60">
              <img
                src={content?.imageUrl ?? "/modern-corporate-building-kuwait-premium-architect.jpg"}
                alt={language === "en" ? "National Orascom" : "ناشونال أوراسكوم"}
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="mb-16">
            <div className="max-w-3xl">
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                {language === "en" ? "Our Story" : "قصتنا"}
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl mb-8 leading-tight">
                {language === "en" ? content?.titleEn ?? content?.title : content?.titleAr ?? content?.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {language === "en" ? content?.contentEn ?? content?.content : content?.contentAr ?? content?.content}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
            <AnimatedSection animation="reveal-up" delay={100}>
              <div className="bg-background/5 border border-border/50 p-8 hover:bg-background/10 transition-colors">
                <Building2 className="h-12 w-12 mb-6 text-muted-foreground" />
                <h3 className="font-serif text-2xl mb-4">{language === "en" ? "Sector Focus" : "القطاعات"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {language === "en" ? content?.industryEn ?? "" : content?.industryAr ?? ""}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="reveal-up" delay={200}>
              <div className="bg-background/5 border border-border/50 p-8 hover:bg-background/10 transition-colors">
                <Users className="h-12 w-12 mb-6 text-muted-foreground" />
                <h3 className="font-serif text-2xl mb-4">{language === "en" ? "Client-First Delivery" : "تنفيذ يركز على العميل"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {language === "en" ? content?.customerEn ?? "" : content?.customerAr ?? ""}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 lg:py-40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {(stats || []).map((stat: any, index: number) => (
              <AnimatedSection key={index} animation="reveal-up" delay={index * 100}>
                <div className="text-center lg:text-left">
                  <p className="font-serif text-5xl lg:text-6xl xl:text-7xl mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground tracking-wide">
                    {language === "en" ? stat.labelEn : stat.labelAr}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="mb-16 lg:mb-24">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
              {language === "en" ? "Our Values" : "قيمنا"}
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl max-w-2xl">
              {language === "en" ? "Principles that guide every project" : "مبادئ توجه كل مشروع"}
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {(values || []).map((value: any, index: number) => (
              <AnimatedSection key={index} animation="reveal-up" delay={index * 100}>
                <div className="space-y-4">
                  <span className="text-xs font-mono opacity-40">0{index + 1}</span>
                  <h3 className="font-serif text-2xl">{language === "en" ? value.titleEn : value.titleAr}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {language === "en" ? value.descEn : value.descAr}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="mb-16 lg:mb-24">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
              {language === "en" ? "Milestones" : "محطات"}
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl max-w-2xl">
              {language === "en" ? "How we’ve grown" : "كيف تطورنا"}
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(milestones || []).map((milestone: any, index: number) => (
              <AnimatedSection key={index} animation="reveal-up" delay={index * 100}>
                <div className="border-t border-border pt-8">
                  <p className="font-serif text-4xl lg:text-5xl mb-4">{milestone.year}</p>
                  <p className="text-muted-foreground">{language === "en" ? milestone.titleEn : milestone.titleAr}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <AnimatedSection animation="reveal-up">
              <div className="space-y-6">
                <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
                  {language === "en" ? "Our Mission" : "مهمتنا"}
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl leading-tight">
                  {language === "en" ? content?.missionEn ?? "" : content?.missionAr ?? ""}
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="reveal-up" delay={200}>
              <div className="space-y-6">
                <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
                  {language === "en" ? "Our Vision" : "رؤيتنا"}
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl leading-tight">
                  {language === "en" ? content?.visionEn ?? "" : content?.visionAr ?? ""}
                </h2>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}

