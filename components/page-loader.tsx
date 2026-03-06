"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { SiteContent } from "@/lib/site-content/schema"

export function PageLoader({ branding }: { branding: SiteContent["branding"] }) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setFadeOut(true)
          setTimeout(() => setLoading(false), 800)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  if (!loading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-all duration-700",
        fadeOut && "opacity-0",
      )}
    >
      {/* Logo */}
      <div className="relative mb-12">
        <div
          className="flex justify-center mb-8"
          style={{
            opacity: progress > 10 ? 1 : 0,
            transform: `scale(${progress > 10 ? 1 : 0.96})`,
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="h-20 w-20 border border-border/60 bg-background/60 backdrop-blur flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={branding.logo.src} alt={branding.logo.alt.en} className="h-14 w-14 object-contain" />
          </div>
        </div>

        <span
          className="font-serif text-5xl md:text-7xl font-semibold tracking-tight text-center block"
          style={{
            opacity: progress > 20 ? 1 : 0,
            transform: `translateY(${progress > 20 ? 0 : 20}px)`,
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {branding.companyName.en.split(" ").slice(0, 1).join(" ")}
          <br />
          {branding.companyName.en.split(" ").slice(1).join(" ") || branding.companyName.en}
        </span>
        <span
          className="absolute -bottom-6 left-0 right-0 text-center text-xs tracking-[0.3em] uppercase text-muted-foreground"
          style={{
            opacity: progress > 40 ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          {branding.tagline.en}
        </span>
      </div>

      {/* Progress line */}
      <div className="w-48 md:w-64 relative">
        <div className="h-px bg-border" />
        <div
          className="absolute top-0 left-0 h-px bg-foreground transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Progress text */}
      <div className="mt-6 text-xs tracking-[0.2em] text-muted-foreground tabular-nums">
        {Math.floor(Math.min(progress, 100))}%
      </div>
    </div>
  )
}
