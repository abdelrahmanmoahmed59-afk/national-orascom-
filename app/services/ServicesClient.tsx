"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

type Service = {
  id: string
  num?: string
  titleEn?: string
  titleAr?: string
  descEn?: string
  descAr?: string
  imageUrl?: string
}

export default function ServicesClient({ services }: { services: Service[] }) {
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

