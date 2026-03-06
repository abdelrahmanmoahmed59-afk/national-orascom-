"use client"

import Link from "next/link"
import { ArrowLeft, ArrowUpRight, MapPin, Calendar, Layers3 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { AnimatedSection } from "@/components/animated-section"
import type { ProjectItem } from "@/lib/site-content/schema"
import { cn } from "@/lib/utils"

export default function ProjectClient({ project }: { project: ProjectItem }) {
  const { language, dir } = useLanguage()

  const scope = language === "en" ? project.scopeEn : project.scopeAr
  const highlights = language === "en" ? project.highlightsEn : project.highlightsAr
  const details =
    language === "en" ? (project.detailsEn ?? "").trim() : (project.detailsAr ?? "").trim()
  const gallery = Array.from(new Set([project.heroImageUrl, ...(project.galleryImageUrls || [])].filter(Boolean)))

  return (
    <div dir={dir} className="overflow-hidden">
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="reveal-up">
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className={cn("h-4 w-4", dir === "rtl" && "rotate-180")} />
              {language === "en" ? "Back to Projects" : "العودة إلى المشاريع"}
            </Link>
          </AnimatedSection>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start mt-10">
            <div className="lg:col-span-6">
              <AnimatedSection animation="mask-up">
                <div className="aspect-4/3 overflow-hidden border border-border/60">
                  <img
                    src={project.heroImageUrl}
                    alt={language === "en" ? project.titleEn : project.titleAr}
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-6">
              <AnimatedSection animation="reveal-up">
                <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
                  {language === "en" ? project.categoryEn : project.categoryAr}
                </p>
              </AnimatedSection>
              <AnimatedSection animation="reveal-up" delay={100}>
                <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl leading-tight mt-4">
                  {language === "en" ? project.titleEn : project.titleAr}
                </h1>
              </AnimatedSection>
              <AnimatedSection animation="reveal-up" delay={200}>
                <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                  {language === "en" ? project.summaryEn : project.summaryAr}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="reveal-up" delay={300} className="mt-8">
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="border border-border/60 p-4">
                    <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {language === "en" ? "Location" : "الموقع"}
                    </div>
                    <p className="mt-2 text-sm">
                      {language === "en" ? project.locationEn : project.locationAr}
                    </p>
                  </div>
                  <div className="border border-border/60 p-4">
                    <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {language === "en" ? "Year" : "السنة"}
                    </div>
                    <p className="mt-2 text-sm">{project.year}</p>
                  </div>
                  <div className="border border-border/60 p-4">
                    <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                      <Layers3 className="h-4 w-4" />
                      {language === "en" ? "Category" : "التصنيف"}
                    </div>
                    <p className="mt-2 text-sm">{language === "en" ? project.categoryEn : project.categoryAr}</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Scope + Highlights */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {details && (
            <AnimatedSection animation="reveal-up" className="mb-14 lg:mb-16">
              <h2 className="font-serif text-3xl lg:text-4xl">{language === "en" ? "Project Details" : "تفاصيل المشروع"}</h2>
              <p className="text-muted-foreground leading-relaxed mt-6 whitespace-pre-line">{details}</p>
            </AnimatedSection>
          )}

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <AnimatedSection animation="reveal-up">
              <h2 className="font-serif text-3xl lg:text-4xl">{language === "en" ? "Scope of Work" : "نطاق الأعمال"}</h2>
              <ul className="mt-6 space-y-3 text-muted-foreground list-disc ps-5">
                {scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection animation="reveal-up" delay={100}>
              <h2 className="font-serif text-3xl lg:text-4xl">{language === "en" ? "Highlights" : "أبرز النقاط"}</h2>
              <ul className="mt-6 space-y-3 text-muted-foreground list-disc ps-5">
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="reveal-up" delay={200} className="mt-16">
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm tracking-wide hover-border-reveal pb-1">
              {language === "en" ? "Discuss a similar project" : "ناقش مشروعاً مشابهاً"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="mb-10">
            <h2 className="font-serif text-3xl lg:text-4xl">{language === "en" ? "Gallery" : "معرض الصور"}</h2>
          </AnimatedSection>

          {gallery.length === 0 ? (
            <p className="text-muted-foreground">{language === "en" ? "No images yet." : "لا توجد صور بعد."}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {gallery.map((src, index) => (
                <AnimatedSection key={`${project.slug}-${index}`} animation="mask-up" delay={Math.min(index * 75, 250)}>
                  <div className="aspect-square overflow-hidden border border-border/60 hover-image-zoom">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
