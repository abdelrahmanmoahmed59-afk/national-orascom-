"use client"

import type React from "react"
import { useScrollAnimation } from "@/lib/animation-system"
import { useScrollDirection } from "@/lib/scroll-direction-context"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type AnimationType =
  | "reveal-up"
  | "reveal-down"
  | "reveal-left"
  | "reveal-right"
  | "reveal-scale"
  | "reveal-rotate"
  | "mask-right"
  | "mask-left"
  | "mask-up"
  | "mask-center"
  | "text-clip"
  | "letter-spacing"
  | "none"

interface AnimatedSectionProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
  threshold?: number
  as?: "div" | "section" | "article" | "span" | "p" | "h1" | "h2" | "h3" | "li"
}

export function AnimatedSection({
  children,
  animation = "reveal-up",
  delay = 0,
  className,
  threshold = 0.1,
  as: Component = "div",
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold,
  })

  const { direction } = useScrollDirection()

  const getDirectionClass = () => {
    if (!isVisible || !direction) return ""
    if (direction === "down") return "scroll-anim-slide-from-bottom"
    if (direction === "up") return "scroll-anim-slide-from-top"
    return ""
  }

  const getDelayClass = () => {
    if (delay === 0) return ""
    if (delay <= 100) return "delay-100"
    if (delay <= 200) return "delay-200"
    if (delay <= 300) return "delay-300"
    if (delay <= 400) return "delay-400"
    if (delay <= 500) return "delay-500"
    if (delay <= 600) return "delay-600"
    if (delay <= 700) return "delay-700"
    if (delay <= 800) return "delay-800"
    return "delay-1000"
  }

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        animation !== "none" && "opacity-0",
        isVisible && animation !== "none" && `animate-${animation}`,
        isVisible && getDelayClass(),
        getDirectionClass(),
        className,
      )}
    >
      {children}
    </Component>
  )
}
