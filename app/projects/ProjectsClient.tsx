"use client"

import Link from "next/link"
import { ChevronDown, ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { AnimatedSection } from "@/components/animated-section"
import type { ProjectItem } from "@/lib/site-content/schema"

export default function ProjectsClient({ projects }: { projects: ProjectItem[] }) {
  const { language, dir } = useLanguage()

  function formatAmount(value?: number) {
    if (typeof value !== "number" || Number.isNaN(value)) return "—"
    try {
      const locale = language === "en" ? "en-US" : "ar-KW"
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)
    } catch {
      return String(value)
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
                {language === "en" ? "Our Work" : "أعمالنا"}
              </p>
            </AnimatedSection>
            <AnimatedSection animation="reveal-up" delay={100}>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl leading-[0.95]">
                {language === "en" ? (
                  <>
                    Projects that
                    <br />
                    <span className="italic font-normal">deliver</span>
                  </>
                ) : (
                  <>
                    مشاريع
                    <br />
                    <span className="italic font-normal">تنجز</span>
                  </>
                )}
              </h1>
            </AnimatedSection>
            <AnimatedSection animation="reveal-up" delay={200}>
              <p className="text-lg text-muted-foreground leading-relaxed mt-8">
                {language === "en"
                  ? "Explore a selection of project packages delivered with disciplined planning, strong site leadership, and safety-first execution."
                  : "استعرض مجموعة من المشاريع التي تم تسليمها عبر تخطيط منضبط وقيادة ميدانية قوية وتنفيذ يضع السلامة أولاً."}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Projects table */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="mb-10 lg:mb-14">
            <h2 className="font-serif text-3xl lg:text-4xl">
              {language === "en" ? "Projects Table" : "جدول المشاريع"}
            </h2>
            <p className="text-muted-foreground mt-3">
              {language === "en"
                ? "A quick, structured overview of our projects. Tap a row to open the full details page."
                : "نظرة سريعة ومنظمة على مشاريعنا. اضغط على أي صف لفتح صفحة التفاصيل الكاملة."}
            </p>
          </AnimatedSection>

          {projects.length === 0 ? (
            <AnimatedSection animation="reveal-up" delay={150}>
              <div className="border border-border/60 p-8 text-muted-foreground">
                {language === "en" ? "No projects yet." : "لا توجد مشاريع بعد."}
              </div>
            </AnimatedSection>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {projects.map((project, index) => {
                  const href = `/projects/${encodeURIComponent(project.slug)}`
                  const title = language === "en" ? project.titleEn : project.titleAr
                  const client = (language === "en" ? project.clientEn : project.clientAr) || "—"
                  const location = language === "en" ? project.locationEn : project.locationAr
                  const typeOfWork = language === "en" ? project.categoryEn : project.categoryAr
                  const status = (language === "en" ? project.statusEn : project.statusAr) || "—"
                  return (
                    <AnimatedSection key={project.slug} animation="reveal-up" delay={Math.min(index * 50, 250)}>
                      <Link
                        href={href}
                        className="block border border-border/60 bg-background/40 hover:bg-muted transition-colors p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                              {language === "en" ? "S.N" : "م"} {index + 1}
                            </p>
                            <p className="font-serif text-xl mt-2 line-clamp-2">{title}</p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                              {language === "en" ? "Client" : "العميل"}
                            </p>
                            <p className="text-muted-foreground line-clamp-2">{client}</p>
                          </div>
                          <div>
                            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                              {language === "en" ? "Location" : "الموقع"}
                            </p>
                            <p className="text-muted-foreground line-clamp-2">{location}</p>
                          </div>
                          <div>
                            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                              {language === "en" ? "Type" : "نوع العمل"}
                            </p>
                            <p className="text-muted-foreground line-clamp-2">{typeOfWork}</p>
                          </div>
                          <div>
                            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                              {language === "en" ? "Amount (KD)" : "القيمة (د.ك)"}
                            </p>
                            <p className="text-muted-foreground">{formatAmount(project.amountKd)}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                              {language === "en" ? "Status" : "الحالة"}
                            </p>
                            <p className="text-muted-foreground line-clamp-2">{status}</p>
                          </div>
                        </div>
                      </Link>
                    </AnimatedSection>
                  )
                })}
              </div>

              {/* Desktop table */}
              <AnimatedSection animation="reveal-up" delay={150} className="hidden md:block">
                <div className="border border-border/60 bg-background/40 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-[1100px] w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr className="text-start">
                          <th className="p-3 font-medium w-16">{language === "en" ? "S.N" : "م"}</th>
                          <th className="p-3 font-medium">{language === "en" ? "Name of Project" : "اسم المشروع"}</th>
                          <th className="p-3 font-medium">{language === "en" ? "Client" : "العميل"}</th>
                          <th className="p-3 font-medium">{language === "en" ? "Location" : "الموقع"}</th>
                          <th className="p-3 font-medium">{language === "en" ? "Type of work" : "نوع العمل"}</th>
                          <th className="p-3 font-medium">{language === "en" ? "Amount (KD)" : "القيمة (د.ك)"}</th>
                          <th className="p-3 font-medium">{language === "en" ? "Status" : "الحالة"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project, index) => {
                          const href = `/projects/${encodeURIComponent(project.slug)}`
                          const title = language === "en" ? project.titleEn : project.titleAr
                          const client = (language === "en" ? project.clientEn : project.clientAr) || "—"
                          const location = language === "en" ? project.locationEn : project.locationAr
                          const typeOfWork = language === "en" ? project.categoryEn : project.categoryAr
                          const status = (language === "en" ? project.statusEn : project.statusAr) || "—"
                          return (
                            <tr key={project.slug} className="border-t border-border/60 hover:bg-muted/30 transition-colors">
                              <td className="p-3 whitespace-nowrap text-muted-foreground">{index + 1}</td>
                              <td className="p-3">
                                <Link href={href} className="font-medium hover:underline">
                                  {title}
                                </Link>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {project.year} • {location}
                                </div>
                              </td>
                              <td className="p-3 text-muted-foreground">{client}</td>
                              <td className="p-3 text-muted-foreground">{location}</td>
                              <td className="p-3 text-muted-foreground">{typeOfWork}</td>
                              <td className="p-3 text-muted-foreground">{formatAmount(project.amountKd)}</td>
                              <td className="p-3 text-muted-foreground">{status}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>

      {/* Projects (dropdown per project) */}
      <section className="py-24 lg:py-40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection animation="reveal-up" className="mb-10 lg:mb-14">
            <h2 className="font-serif text-3xl lg:text-4xl">
              {language === "en" ? "Project Portfolio" : "محفظة المشاريع"}
            </h2>
            <p className="text-muted-foreground mt-3">
              {language === "en"
                ? "Open a project to view scope highlights, then visit the full page for details."
                : "افتح المشروع لعرض أبرز نطاق الأعمال، ثم انتقل للصفحة الكاملة للتفاصيل."}
            </p>
          </AnimatedSection>

          <div className="space-y-4">
            {projects.map((project, index) => (
              <AnimatedSection key={project.slug} animation="reveal-up" delay={Math.min(index * 75, 300)}>
                <details className="group border border-border/60 bg-background/50 hover:bg-background/70 transition-colors">
                  <summary className="cursor-pointer list-none p-6 lg:p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                          {language === "en" ? project.categoryEn : project.categoryAr} •{" "}
                          {language === "en" ? project.locationEn : project.locationAr} • {project.year}
                        </p>
                        <h3 className="font-serif text-2xl lg:text-3xl mt-2">
                          {language === "en" ? project.titleEn : project.titleAr}
                        </h3>
                      </div>
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
                    </div>
                  </summary>

                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <div className="grid lg:grid-cols-12 gap-10 items-start">
                      <div className="lg:col-span-5">
                        <div className="aspect-4/3 overflow-hidden border border-border/60">
                          <img
                            src={project.heroImageUrl}
                            alt={language === "en" ? project.titleEn : project.titleAr}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-7 space-y-6">
                        <p className="text-muted-foreground leading-relaxed">
                          {language === "en" ? project.summaryEn : project.summaryAr}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                              {language === "en" ? "Scope" : "نطاق الأعمال"}
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc ps-5">
                              {(language === "en" ? project.scopeEn : project.scopeAr).map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                              {language === "en" ? "Highlights" : "أبرز النقاط"}
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc ps-5">
                              {(language === "en" ? project.highlightsEn : project.highlightsAr).map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <Link
                          href={`/projects/${encodeURIComponent(project.slug)}`}
                          className="inline-flex items-center gap-2 text-sm tracking-wide hover-border-reveal pb-1"
                        >
                          {language === "en" ? "View project details" : "عرض تفاصيل المشروع"}
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
