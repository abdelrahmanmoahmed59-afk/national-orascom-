"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { AnimatedSection } from "@/components/animated-section"
import { ContactMain } from "@/components/contact-main"
import type { SiteContent } from "@/lib/site-content/schema"

export default function ContactClient({ contact }: { contact: SiteContent["contact"] }) {
  const { language, dir } = useLanguage()

  return (
    <div dir={dir} className="overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-[50vh] flex items-end pt-32 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <AnimatedSection animation="reveal-up">
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
                {language === "en" ? "Contact Us" : "تواصل معنا"}
              </p>
            </AnimatedSection>
            <AnimatedSection animation="reveal-up" delay={100}>
              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl leading-[0.95]">
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
              </h1>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <ContactMain contact={contact} />
    </div>
  )
}
