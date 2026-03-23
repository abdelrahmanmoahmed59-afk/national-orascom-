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
  const cycleItems = useMemo(() => {
    if (items.length === 0) return []
    const minItemsPerCycle = 8
    const repeatCount = Math.max(1, Math.ceil(minItemsPerCycle / items.length))
    return Array.from({ length: repeatCount }, () => items).flat()
  }, [items])
  const duplicated = useMemo(() => {
    if (cycleItems.length === 0) return []
    return [...cycleItems, ...cycleItems]
  }, [cycleItems])

  if (items.length === 0) return null

  const trackClass = dir === "rtl" ? "animate-marquee-reverse" : "animate-marquee"

  return (
    <div
      dir="ltr"
      className={cn(
        "group relative overflow-hidden border border-border/60 bg-background/50",
        "motion-reduce:overflow-x-auto motion-reduce:overscroll-x-contain",
        className,
      )}
      aria-label={language === "en" ? "Client logos" : "شعارات العملاء"}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />

      <div
        className={cn(
          "flex w-max min-w-max items-center justify-start gap-6 py-8 px-6",
          trackClass,
          "motion-reduce:animate-none",
          "group-hover:[animation-play-state:paused]",
        )}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {duplicated.map((client, index) => (
          <div
            key={`${client.id}-${index}`}
            className="shrink-0 flex h-28 w-64 items-center justify-center border border-border/60 bg-card/95 px-5 shadow-[0_10px_28px_rgba(15,15,15,0.06)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={client.logoSrc}
              alt={client.name?.[language] ?? ""}
              className="max-h-20 w-full object-contain opacity-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
