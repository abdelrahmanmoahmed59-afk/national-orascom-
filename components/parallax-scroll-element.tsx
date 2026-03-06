"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useScrollDirection } from "@/lib/scroll-direction-context"
import { cn } from "@/lib/utils"

interface ParallaxScrollElementProps {
  children: ReactNode
  speed?: number
  direction?: "vertical" | "horizontal"
  className?: string
}

export function ParallaxScrollElement({
  children,
  speed = 0.5,
  direction = "vertical",
  className,
}: ParallaxScrollElementProps) {
  const { scrollY, direction: scrollDir } = useScrollDirection()
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const elementTop = rect.top + scrollY
    const relativeScroll = scrollY - elementTop + window.innerHeight
    const parallaxOffset = relativeScroll * speed * 0.1

    setOffset(parallaxOffset)
  }, [scrollY, speed])

  const transform = direction === "vertical" ? `translateY(${offset}px)` : `translateX(${offset}px)`

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        transform,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  )
}
