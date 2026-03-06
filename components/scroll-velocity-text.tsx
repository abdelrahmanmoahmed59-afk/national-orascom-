"use client"

import { useScrollDirection } from "@/lib/scroll-direction-context"
import { cn } from "@/lib/utils"
import { useRef } from "react"

interface ScrollVelocityTextProps {
  text: string
  className?: string
  baseVelocity?: number
}

export function ScrollVelocityText({ text, className, baseVelocity = 1 }: ScrollVelocityTextProps) {
  const { direction, velocity, isScrolling } = useScrollDirection()
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate animation speed based on scroll velocity
  const animationDuration = Math.max(10 - velocity * 5, 3)

  return (
    <div ref={containerRef} className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div
        className={cn("inline-flex", direction === "up" ? "animate-scroll-left" : "animate-scroll-right")}
        style={{
          animationDuration: `${animationDuration}s`,
          animationPlayState: isScrolling ? "running" : "paused",
        }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-8 flex-shrink-0">
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
