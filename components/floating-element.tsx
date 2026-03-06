"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface FloatingElementProps {
  children: ReactNode
  className?: string
  type?: "float" | "float-slow" | "bounce-subtle" | "wave"
  delay?: number
}

export function FloatingElement({ children, className, type = "float", delay = 0 }: FloatingElementProps) {
  return (
    <div className={cn(`animate-${type}`, className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
