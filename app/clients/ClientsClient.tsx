"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { ClientsLogoSlider } from "@/components/clients-logo-slider"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SiteContent } from "@/lib/site-content/schema"

export default function ClientsClient({ clients }: { clients: SiteContent["clients"] }) {
  const { language, dir } = useLanguage()

  const title = clients.title[language]
  const subtitle = clients.subtitle[language]
  const description = clients.description[language]
  const highlights = clients.highlights?.[language] || []

  return (
    <div dir={dir} className="overflow-hidden">
      {/* Hero */}
      <section className="min-h-[50vh] flex items-end pt-32 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <AnimatedSection animation="reveal-up">
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">{subtitle}</p>
            </AnimatedSection>
            <AnimatedSection animation="reveal-up" delay={100}>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl leading-[0.95]">
                {language === "en" ? (
                  <>
                    Our
                    <br />
                    <span className="italic font-normal">{title}</span>
                  </>
                ) : (
                  <>
                    {title}
                    <br />
                    <span className="italic font-normal">{language === "ar" ? "شركاؤنا" : ""}</span>
                  </>
                )}
              </h1>
            </AnimatedSection>
            <AnimatedSection animation="reveal-up" delay={200}>
              <p className="text-lg text-muted-foreground leading-relaxed mt-8">{description}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                {language === "en" ? "Partners" : "الشركاء"}
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl">{language === "en" ? "Client network" : "شبكة العملاء"}</h2>
            </div>
            <Button asChild variant="outline" size="lg" className="rounded-none px-8 h-14 bg-transparent">
              <Link href="/contact">
                {language === "en" ? "Work with us" : "اعمل معنا"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>

          {clients.items.length === 0 ? (
            <AnimatedSection animation="reveal-up" delay={150} className="mt-12">
              <p className="text-muted-foreground">{language === "en" ? "No clients added yet." : "لا يوجد عملاء بعد."}</p>
            </AnimatedSection>
          ) : (
            <AnimatedSection animation="reveal-up" delay={150} className="mt-14">
              <ClientsLogoSlider clients={clients.items} durationSeconds={30} />
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            <div className="lg:col-span-5">
              <AnimatedSection animation="reveal-up">
                <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                  {language === "en" ? "How we work" : "كيف نعمل"}
                </p>
                <h2 className="font-serif text-4xl lg:text-5xl leading-tight">
                  {language === "en" ? "Built for long-term partnerships" : "شراكات طويلة الأمد"}
                </h2>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-7">
              <AnimatedSection animation="reveal-up" delay={150}>
                <ul className="space-y-4 text-muted-foreground list-disc ps-5">
                  {highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AnimatedSection>

              <AnimatedSection animation="reveal-up" delay={250} className="mt-10">
                <Link href="/projects" className="inline-flex items-center gap-2 text-sm tracking-wide hover-border-reveal pb-1">
                  {language === "en" ? "See our projects" : "اطّلع على مشاريعنا"}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
