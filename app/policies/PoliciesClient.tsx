"use client"

import { ScrollAnimatedElement } from "@/components/scroll-animated-element"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SiteContent } from "@/lib/site-content/schema"

export default function PoliciesClient({ policies }: { policies: SiteContent["policies"] }) {
  const { language, dir } = useLanguage()

  const commitments = language === "en" ? policies.commitmentsEn : policies.commitmentsAr

  return (
    <div dir={dir} className="min-h-screen">
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <ScrollAnimatedElement animation="slide-up">
            <h1 className="font-serif text-4xl lg:text-5xl mb-4">
              {language === "en" ? "Policies" : "السياسات"}
            </h1>
            <p className="text-muted-foreground max-w-3xl whitespace-pre-line">
              {policies.intro[language]}
            </p>
          </ScrollAnimatedElement>

          <div className="mt-12 space-y-6">
            <ScrollAnimatedElement animation="fade" delay={50}>
              <article className="bg-background/5 p-6 border border-border rounded-md">
                <h2 className="font-semibold mb-2">{language === "en" ? "We are committed to:" : "نلتزم بـ:"}</h2>
                <ul className="list-disc ps-5 text-sm text-muted-foreground space-y-2">
                  {commitments.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </ScrollAnimatedElement>
          </div>
        </div>
      </section>
    </div>
  )
}

