"use client"

import { useMemo } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import type { ClientItem } from "@/lib/site-content/schema"
import { cn } from "@/lib/utils"

export function ClientsLogoSlider({
  clients,
  className,
  durationSeconds = 32,
}: {
  clients: ClientItem[]
  className?: string
  durationSeconds?: number
}) {
  const { language, dir } = useLanguage()

  const items = useMemo(() => (clients || []).filter((c) => c.logoSrc), [clients])
  if (items.length === 0) return null

  const duplicated = useMemo(() => {
    const copies = items.length < 8 ? 3 : 2
    return Array.from({ length: copies }, () => items).flat()
  }, [items])

  const trackClass = dir === "rtl" ? "animate-marquee-reverse" : "animate-marquee"

  return (
    <div
      className={cn(
        "group relative overflow-hidden border border-border/60 bg-background/40",
        "motion-reduce:overflow-x-auto motion-reduce:overscroll-x-contain",
        className,
      )}
      aria-label={language === "en" ? "Client logos" : "شعارات العملاء"}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />

      <div
        className={cn(
          "flex w-max items-center gap-10 py-6 px-4",
          trackClass,
          "motion-reduce:animate-none",
          "group-hover:[animation-play-state:paused]",
        )}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {duplicated.map((client, index) => (
          <div key={`${client.id}-${index}`} className="shrink-0 flex items-center justify-center h-14 w-44">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={client.logoSrc}
              alt={client.name?.[language] ?? ""}
              className="max-h-12 max-w-full object-contain opacity-80"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

