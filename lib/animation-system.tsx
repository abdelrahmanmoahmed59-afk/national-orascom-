"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react"

// Animation configuration
export const ANIMATION_CONFIG = {
  defaultDuration: 700,
  defaultEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
  staggerDelay: 100,
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

// Animation types
export type AnimationType =
  | "fade-in-up"
  | "fade-in-down"
  | "fade-in-left"
  | "fade-in-right"
  | "scale-in"
  | "blur-in"
  | "slide-in-up"
  | "rotate-in"
  | "flip-in-x"
  | "flip-in-y"
  | "zoom-in-bounce"
  | "none"

export type ContinuousAnimation =
  | "float"
  | "float-slow"
  | "pulse-glow"
  | "shimmer"
  | "spin-slow"
  | "bounce-subtle"
  | "wave"
  | "gradient-shift"
  | "morph"
  | "none"

export type HoverAnimation = "lift" | "scale" | "glow" | "shine" | "none"

// Animation context for global controls
interface AnimationContextType {
  isAnimationsEnabled: boolean
  setAnimationsEnabled: (enabled: boolean) => void
  animationSpeed: number
  setAnimationSpeed: (speed: number) => void
  hasPageLoaded: boolean
}

const AnimationContext = createContext<AnimationContextType>({
  isAnimationsEnabled: true,
  setAnimationsEnabled: () => {},
  animationSpeed: 1,
  setAnimationSpeed: () => {},
  hasPageLoaded: false,
})

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [isAnimationsEnabled, setAnimationsEnabled] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [hasPageLoaded, setHasPageLoaded] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) {
      setAnimationsEnabled(false)
    }

    // Set page loaded after initial render
    const timer = setTimeout(() => setHasPageLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimationContext.Provider
      value={{
        isAnimationsEnabled,
        setAnimationsEnabled,
        animationSpeed,
        setAnimationSpeed,
        hasPageLoaded,
      }}
    >
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  return useContext(AnimationContext)
}

// Hook for scroll-triggered animations
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
    delay?: number
  } = {},
) {
  const {
    threshold = ANIMATION_CONFIG.threshold,
    rootMargin = ANIMATION_CONFIG.rootMargin,
    triggerOnce = true,
    delay = 0,
  } = options

  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const { isAnimationsEnabled } = useAnimation()

  useEffect(() => {
    if (!isAnimationsEnabled) {
      setIsVisible(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true)
              setHasAnimated(true)
            }, delay)
          } else {
            setIsVisible(true)
            setHasAnimated(true)
          }
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [threshold, rootMargin, triggerOnce, delay, isAnimationsEnabled])

  return { ref, isVisible, hasAnimated }
}

// Hook for parallax effects
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.scrollY
        const rate = (rect.top + scrolled - window.innerHeight / 2) * speed * 0.1
        setOffset(rate)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return { ref, offset, style: { transform: `translateY(${offset}px)` } }
}

// Hook for counting animation
export function useCountUp(
  target: number,
  options: {
    duration?: number
    delay?: number
    startOnVisible?: boolean
  } = {},
) {
  const { duration = 2000, delay = 0, startOnVisible = true } = options
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const startCounting = useCallback(() => {
    if (hasStarted) return
    setHasStarted(true)

    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime - delay
      if (elapsed < 0) return

      const progress = Math.min(elapsed / duration, 1)
      // Easing function for smoother animation
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress >= 1) {
        setCount(target)
        clearInterval(timer)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [target, duration, delay, hasStarted])

  useEffect(() => {
    if (!startOnVisible) {
      setTimeout(startCounting, delay)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(startCounting, delay)
          observer.unobserve(element)
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [startCounting, startOnVisible, delay])

  return { ref, count, hasStarted }
}

// Hook for staggered children animations
export function useStaggeredAnimation<T extends HTMLElement = HTMLDivElement>(
  childCount: number,
  options: {
    baseDelay?: number
    staggerDelay?: number
  } = {},
) {
  const { baseDelay = 0, staggerDelay = ANIMATION_CONFIG.staggerDelay } = options
  const { ref, isVisible } = useScrollAnimation<T>()

  const getChildDelay = (index: number) => baseDelay + index * staggerDelay

  return { ref, isVisible, getChildDelay }
}

// Hook for magnetic button effect
export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = (e.clientX - centerX) * strength
      const distY = (e.clientY - centerY) * strength
      setPosition({ x: distX, y: distY })
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [strength])

  return {
    ref,
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
    },
  }
}

// Hook for text reveal animation
export function useTextReveal(text: string, options: { delay?: number } = {}) {
  const { delay = 0 } = options
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    if (!isVisible) return

    let index = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index))
          index++
        } else {
          clearInterval(interval)
        }
      }, 30)
      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [isVisible, text, delay])

  return { ref, displayText, isVisible }
}
