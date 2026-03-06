"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useScrollDirection } from "@/lib/scroll-direction-context"
import { useAnimation } from "@/lib/animation-system"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime"

type ScrollAnimation =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "rotate"
  | "blur"
  | "flip-x"
  | "flip-y"
  | "zoom-bounce"

interface ScrollAnimatedElementProps {
  children: ReactNode
  animation?: ScrollAnimation
  animationUp?: ScrollAnimation
  animationDown?: ScrollAnimation
  className?: string
  delay?: number
  threshold?: number
  once?: boolean
  as?: keyof JSX.IntrinsicElements
}

export function ScrollAnimatedElement({
  children,
  animation = "fade",
  animationUp,
  animationDown,
  className,
  delay = 0,
  threshold = 0.1,
  once = false,
  as: Component = "div",
}: ScrollAnimatedElementProps) {
  const { direction } = useScrollDirection()
  const { isAnimationsEnabled } = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!isAnimationsEnabled) {
      setIsVisible(true)
      setHasAnimated(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setHasAnimated(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once && hasAnimated) {
          setIsVisible(false)
        }
      },
      { threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, once, hasAnimated, isAnimationsEnabled])

  // Determine which animation to use based on scroll direction
  const currentAnimation =
    direction === "up" ? animationUp || animation : direction === "down" ? animationDown || animation : animation

  const getAnimationClass = () => {
    if (!isAnimationsEnabled) return ""
    if (!isVisible) return "scroll-anim-hidden"

    switch (currentAnimation) {
      case "fade":
        return "scroll-anim-fade-in"
      case "slide-up":
        return direction === "up" ? "scroll-anim-slide-from-top" : "scroll-anim-slide-from-bottom"
      case "slide-down":
        return direction === "up" ? "scroll-anim-slide-from-bottom" : "scroll-anim-slide-from-top"
      case "slide-left":
        return "scroll-anim-slide-from-right"
      case "slide-right":
        return "scroll-anim-slide-from-left"
      case "scale":
        return direction === "up" ? "scroll-anim-scale-down-in" : "scroll-anim-scale-up-in"
      case "rotate":
        return direction === "up" ? "scroll-anim-rotate-in-up" : "scroll-anim-rotate-in-down"
      case "blur":
        return "scroll-anim-blur-in"
      case "flip-x":
        return direction === "up" ? "scroll-anim-flip-x-up" : "scroll-anim-flip-x-down"
      case "flip-y":
        return direction === "up" ? "scroll-anim-flip-y-up" : "scroll-anim-flip-y-down"
      case "zoom-bounce":
        return "scroll-anim-zoom-bounce"
      default:
        return "scroll-anim-fade-in"
    }
  }

  const Comp = Component as any

  return (
    <Comp ref={ref} className={cn(getAnimationClass(), className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </Comp>
  )
}
