"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react"
import { useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ParallaxScrollElement } from "@/components/parallax-scroll-element"
import { ScrollAnimatedElement } from "@/components/scroll-animated-element"
import { ScrollRevealSection } from "@/components/scroll-reveal-section"
import { useCountUp } from "@/lib/animation-system"
import { useLanguage } from "@/lib/i18n/language-context"
import type { ProjectItem, ServiceItem, SiteContent } from "@/lib/site-content/schema"
import { AnimatedSection } from "@/components/animated-section"
import { ContactMain } from "@/components/contact-main"
import { ClientsLogoSlider } from "@/components/clients-logo-slider"

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { ref, count } = useCountUp(value, { duration: 2200 })
  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

export default function HomeClient({
  services,
  projects,
  clients,
  contact,
}: {
  services: ServiceItem[]
  projects: ProjectItem[]
  clients: SiteContent["clients"]
  contact: SiteContent["contact"]
}) {
  const { language, t, dir } = useLanguage()
  const heroRef = useRef<HTMLElement | null>(null)

  const featuredServices = useMemo(() => services.slice(0, 3), [services])
  const featuredProjects = useMemo(
    () => projects.filter((project) => project.showInProjectsDropdown !== false).slice(0, 3),
    [projects],
  )

  const stats = useMemo(
    () => [
      { value: 15, suffix: "+", labelEn: "Years of Delivery", labelAr: "سنوات من الإنجاز" },
      { value: 120, suffix: "+", labelEn: "Projects Supported", labelAr: "مشروع تم دعمه" },
      { value: 300, suffix: "+", labelEn: "Team Members", labelAr: "عضو فريق" },
      { value: 6, suffix: "+", labelEn: "Service Lines", labelAr: "مجالات خدمة" },
    ],
    [],
  )

  const scrollToNextSection = () => {
    const hero = heroRef.current
    if (!hero) return
    const next = hero.nextElementSibling as HTMLElement | null
    if (!next) return

    const nav = document.querySelector("nav") as HTMLElement | null
    const navHeight = nav ? nav.offsetHeight : 0
    const top = next.getBoundingClientRect().top + window.scrollY - navHeight
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <div dir={dir} className="overflow-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24">
        <div className="absolute inset-0 construction-hero-bg" aria-hidden="true" />
        <div className="absolute inset-0 construction-hero-sweep" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-28 relative">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-10">
              <ScrollAnimatedElement animation="slide-up" className="space-y-4">
                <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
                  {language === "en" ? "Construction & Contracting" : "البناء والمقاولات"}
                </p>
              </ScrollAnimatedElement>

              <ScrollAnimatedElement animation="slide-up" delay={75}>
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight">
                  {t.hero.title}
                  <br />
                  <span className="italic font-normal">{t.hero.subtitle}</span>
                </h1>
              </ScrollAnimatedElement>

              <ScrollAnimatedElement animation="blur" delay={150}>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{t.hero.description}</p>
              </ScrollAnimatedElement>

              <ScrollAnimatedElement animation="slide-up" delay={225}>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="rounded-none px-8 h-14">
                    <Link href="/projects">
                      {t.hero.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-none px-8 h-14 bg-transparent">
                    <Link href="/contact">{t.hero.ctaSecondary}</Link>
                  </Button>
                </div>
              </ScrollAnimatedElement>

              <ScrollRevealSection staggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                {stats.map((stat) => (
                  <div key={stat.labelEn} className="border-t border-border/60 pt-6">
                    <p className="font-serif text-3xl lg:text-4xl mb-2">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs tracking-wide text-muted-foreground">
                      {language === "en" ? stat.labelEn : stat.labelAr}
                    </p>
                  </div>
                ))}
              </ScrollRevealSection>
            </div>

            <div className="lg:col-span-5">
              <ParallaxScrollElement speed={-0.15}>
                <ScrollAnimatedElement animation="scale" delay={150}>
                  <div className="relative aspect-4/5 overflow-hidden border border-border/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/modern-corporate-building-kuwait-premium-architect.jpg"
                      alt={language === "en" ? "Construction project" : "مشروع بناء"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/10" />
                  </div>
                </ScrollAnimatedElement>
              </ParallaxScrollElement>
            </div>
          </div>

          {/* Scroll indicator */}
          <button
            type="button"
            onClick={scrollToNextSection}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={language === "en" ? "Scroll to next section" : "انتقل إلى القسم التالي"}
          >
            <ChevronDown className="h-5 w-5 animate-bounce-subtle" />
          </button>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollRevealSection staggerChildren className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-end">
            <div className="lg:col-span-5">
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                {language === "en" ? "Capabilities" : "قدراتنا"}
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl leading-tight">
                {language === "en" ? "Services built for delivery" : "خدمات مصممة للتسليم"}
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">{t.services.description}</p>
              <Button asChild size="lg" className="rounded-none px-8 h-14">
                <Link href="/services">
                  {language === "en" ? "View All Services" : "عرض جميع الخدمات"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollRevealSection>

          <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-10">
            {featuredServices.map((service, index) => (
              <ScrollAnimatedElement key={service.id} animation="slide-up" delay={index * 75}>
                <Link
                  href="/services"
                  className="group block border border-border/60 p-8 hover:bg-muted transition-colors"
                >
                  <p className="text-xs font-mono text-muted-foreground mb-4">{service.num}</p>
                  <h3 className="font-serif text-2xl mb-3">{language === "en" ? service.titleEn : service.titleAr}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {language === "en" ? service.descEn : service.descAr}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm tracking-wide hover-border-reveal pb-1 mt-6">
                    {t.common.learnMore} <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </ScrollAnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Projects preview */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollRevealSection staggerChildren className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                {language === "en" ? "Portfolio" : "المحفظة"}
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl">{language === "en" ? "Featured projects" : "مشاريع مميزة"}</h2>
            </div>
            <Button asChild variant="outline" size="lg" className="rounded-none px-8 h-14 bg-transparent">
              <Link href="/projects">
                {t.projects.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollRevealSection>

          <div className="mt-16 grid lg:grid-cols-3 gap-6 lg:gap-10">
            {featuredProjects.map((project, index) => (
              <ScrollAnimatedElement key={project.slug} animation="blur" delay={index * 75}>
                <Link href={`/projects/${encodeURIComponent(project.slug)}`} className="group block">
                  <div className="aspect-4/3 overflow-hidden border border-border/60 hover-image-zoom">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.heroImageUrl}
                      alt={language === "en" ? project.titleEn : project.titleAr}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-5">
                    <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                      {language === "en" ? project.categoryEn : project.categoryAr} •{" "}
                      {language === "en" ? project.locationEn : project.locationAr} • {project.year}
                    </p>
                    <h3 className="font-serif text-2xl mt-2">{language === "en" ? project.titleEn : project.titleAr}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-2 line-clamp-3">
                      {language === "en" ? project.summaryEn : project.summaryAr}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm tracking-wide hover-border-reveal pb-1 mt-4">
                      {t.common.viewDetails} <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </ScrollAnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Clients preview */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                {clients.subtitle[language]}
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl">{clients.title[language]}</h2>
            </div>
            <Button asChild variant="outline" size="lg" className="rounded-none px-8 h-14 bg-transparent">
              <Link href="/clients">
                {language === "en" ? "View all clients" : "عرض جميع العملاء"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>

          <AnimatedSection animation="reveal-up" delay={150} className="mt-8 max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed">{clients.description[language]}</p>
          </AnimatedSection>

          {clients.items.length === 0 ? (
            <AnimatedSection animation="reveal-up" delay={250} className="mt-12">
              <p className="text-muted-foreground">{language === "en" ? "No clients added yet." : "لا يوجد عملاء بعد."}</p>
            </AnimatedSection>
          ) : (
            <AnimatedSection animation="reveal-up" delay={200} className="mt-14">
              <ClientsLogoSlider clients={clients.items} />
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <ScrollAnimatedElement animation="slide-up">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
              {language === "en" ? "Careers" : "الوظائف"}
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl max-w-3xl mx-auto mb-8">
              {language === "en" ? "Build with a team that delivers" : "ابنِ معنا ضمن فريق يُنجز"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              {language === "en"
                ? "From site execution to planning and HSE, we’re always looking for talented people."
                : "من التنفيذ الميداني إلى التخطيط والسلامة، نبحث دائماً عن الكفاءات."}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="rounded-none px-8 h-14">
                <Link href="/careers">
                  {t.careers.viewOpenings}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none px-8 h-14 bg-transparent">
                <Link href="/contact">{language === "en" ? "Talk to us" : "تواصل معنا"}</Link>
              </Button>
            </div>
          </ScrollAnimatedElement>
        </div>
      </section>

      {/* Contact (same sections as /contact) */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <AnimatedSection animation="reveal-up">
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                {language === "en" ? "Contact Us" : "تواصل معنا"}
              </p>
            </AnimatedSection>
            <AnimatedSection animation="reveal-up" delay={100}>
              <h2 className="font-serif text-5xl lg:text-6xl xl:text-7xl leading-[0.95]">
                {language === "en" ? (
                  <>
                    Let&apos;s start a
                    <br />
                    <span className="italic font-normal">conversation</span>
                  </>
                ) : (
                  <>
                    لنبدأ
                    <br />
                    <span className="italic font-normal">محادثة</span>
                  </>
                )}
              </h2>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <ContactMain contact={contact} />
    </div>
  )
}
