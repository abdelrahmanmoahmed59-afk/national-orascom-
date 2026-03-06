"use client"

import { useParallax } from "@/lib/animation-system"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function ParallaxSection({ children, speed = 0.5, className }: ParallaxSectionProps) {
  const { ref, style } = useParallax(speed)

  return (
    <div ref={ref} style={style} className={cn("will-animate", className)}>
      {children}
    </div>
  )
}
