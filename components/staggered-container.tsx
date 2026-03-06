"use client"

import { useStaggeredAnimation } from "@/lib/animation-system"
import { cn } from "@/lib/utils"
import { Children, isValidElement, type ReactNode } from "react"

interface StaggeredContainerProps {
  children: ReactNode
  baseDelay?: number
  staggerDelay?: number
  className?: string
  animation?: "fade-in-up" | "fade-in-down" | "fade-in-left" | "fade-in-right" | "scale-in" | "blur-in"
}

export function StaggeredContainer({
  children,
  baseDelay = 0,
  staggerDelay = 100,
  className,
  animation = "fade-in-up",
}: StaggeredContainerProps) {
  const childArray = Children.toArray(children)
  const { ref, isVisible, getChildDelay } = useStaggeredAnimation<HTMLDivElement>(childArray.length, {
    baseDelay,
    staggerDelay,
  })

  return (
    <div ref={ref} className={cn("stagger-children", className)}>
      {childArray.map((child, index) => {
        if (isValidElement(child)) {
          const delay = getChildDelay(index)
          return (
            <div
              key={index}
              className={cn(
                "will-animate opacity-0",
                isVisible && `animate-${animation}`,
                isVisible && `animation-delay-${delay}`,
              )}
              style={{ animationDelay: `${delay}ms` }}
            >
              {child}
            </div>
          )
        }
        return child
      })}
    </div>
  )
}
