"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SiteContent } from "@/lib/site-content/schema"

type Service = SiteContent["services"][number]
type ServiceFeaturePanel = SiteContent["servicesFeaturePanels"][number]

export default function ServicesClient({
  services,
  servicePanels,
}: {
  services: Service[]
  servicePanels: ServiceFeaturePanel[]
}) {
  const { language, t, dir } = useLanguage()

  return (
    <div dir={dir} className="overflow-hidden">
      {/* Hero */}
      <section className="min-h-[60vh] flex items-end pt-32 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <AnimatedSection animation="reveal-up">
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">{t.services.title}</p>
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
              <p className="text-lg text-muted-foreground leading-relaxed">{t.services.description}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {servicePanels.length > 0 && (
        <section className="py-20 lg:py-28 border-t border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <AnimatedSection animation="reveal-up">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                {servicePanels.map((panel) => {
                  const title = language === "en" ? panel.titleEn : panel.titleAr || panel.titleEn
                  const description = language === "en" ? panel.descriptionEn : panel.descriptionAr || panel.descriptionEn
                  const offers = language === "en" ? panel.offersEn : panel.offersAr.length > 0 ? panel.offersAr : panel.offersEn

                  return (
                    <article
                      key={panel.id}
                      className="relative overflow-hidden border border-border/70 bg-card/90 p-6 lg:p-7 shadow-[0_18px_50px_rgba(15,15,15,0.05)]"
                    >
                      <div className="absolute right-5 top-4 text-4xl lg:text-5xl font-semibold text-foreground/8 select-none">
                        {panel.number}
                      </div>
                      <div className="relative z-10 flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <h3 className="max-w-[16rem] text-lg leading-tight font-semibold text-foreground">{title}</h3>
                      </div>
                      <p className="relative z-10 mt-5 text-sm leading-7 text-muted-foreground">{description}</p>
                      <p className="relative z-10 mt-6 text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground">
                        {language === "en" ? "What We Offer:" : "ما الذي نقدمه:"}
                      </p>
                      <ul className="relative z-10 mt-4 space-y-3">
                        {offers.map((offer) => (
                          <li key={offer} className="flex items-start gap-3 text-sm leading-6 text-foreground/80">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                            <span>{offer}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  )
                })}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-24 lg:space-y-40">
            {services.map((service, index) => (
              <AnimatedSection key={service.id ?? index} animation="reveal-up">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                  <div className={index % 2 === 1 ? "lg:order-2 space-y-6" : "space-y-6"}>
                    <span className="text-sm font-mono text-muted-foreground">
                      {service.num ?? (index + 1).toString().padStart(2, "0")}
                    </span>
                    <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl">
                      {language === "en" ? service.titleEn : service.titleAr}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {language === "en" ? service.descEn : service.descAr}
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 text-sm tracking-wide hover-border-reveal pb-1">
                      {t.common.learnMore}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="aspect-4/3 overflow-hidden hover-image-zoom border border-border/60">
                      <img
                        src={service.imageUrl || "/modern-industrial-facility-aerial-view-premium.jpg"}
                        alt={language === "en" ? service.titleEn : service.titleAr}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection animation="reveal-up">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
              {language === "en" ? "Get Started" : "ابدأ الآن"}
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl max-w-3xl mx-auto mb-8">
              {language === "en" ? "Have a project to build?" : "هل لديك مشروع للتنفيذ؟"}
            </h2>
            <Button asChild size="lg" className="rounded-none px-8 h-14">
              <Link href="/contact">
                {language === "en" ? "Contact Us" : "تواصل معنا"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
