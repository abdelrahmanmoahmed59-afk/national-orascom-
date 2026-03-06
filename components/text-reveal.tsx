"use client"

import type React from "react"

import { useScrollAnimation } from "@/lib/animation-system"
import { cn } from "@/lib/utils"

interface TextRevealProps {
  text: string
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
  delay?: number
  charDelay?: number
}

export function TextReveal({ text, className, as: Component = "span", delay = 0 }: TextRevealProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()
  const words = text.split(" ")

  return (
    <Component ref={ref as React.Ref<HTMLHeadingElement>} className={cn("inline", className)}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block overflow-hidden">
          <span
            className={cn(
              "inline-block transform transition-all duration-500",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
            )}
            style={{
              transitionDelay: isVisible ? `${delay + wordIndex * 50}ms` : "0ms",
            }}
          >
            {word}
          </span>
          {wordIndex < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Component>
  )
}
