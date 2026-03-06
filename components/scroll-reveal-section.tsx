"use client"

import type React from "react"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useScrollDirection } from "@/lib/scroll-direction-context"
import { cn } from "@/lib/utils"

interface ScrollRevealSectionProps {
  children: ReactNode
  className?: string
  staggerChildren?: boolean
  staggerDelay?: number
}

export function ScrollRevealSection({
  children,
  className,
  staggerChildren = false,
  staggerDelay = 100,
}: ScrollRevealSectionProps) {
  const { direction } = useScrollDirection()
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "scroll-reveal-section",
        isVisible && "in-view",
        direction === "up" && "scroll-up",
        direction === "down" && "scroll-down",
        staggerChildren && "stagger-children",
        className,
      )}
      style={{ "--stagger-delay": `${staggerDelay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
