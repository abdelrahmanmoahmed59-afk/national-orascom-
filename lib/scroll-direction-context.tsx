"use client"

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react"

interface ScrollDirectionContextType {
  direction: "up" | "down" | null
  scrollY: number
  scrollProgress: number
  velocity: number
  isScrolling: boolean
}

const ScrollDirectionContext = createContext<ScrollDirectionContextType>({
  direction: null,
  scrollY: 0,
  scrollProgress: 0,
  velocity: 0,
  isScrolling: false,
})

export function ScrollDirectionProvider({ children }: { children: ReactNode }) {
  const [direction, setDirection] = useState<"up" | "down" | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())
  const scrollTimeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const currentTime = Date.now()
      const timeDelta = currentTime - lastTime.current
      const scrollDelta = currentScrollY - lastScrollY.current

      // Calculate velocity (pixels per millisecond)
      const currentVelocity = timeDelta > 0 ? Math.abs(scrollDelta) / timeDelta : 0
      setVelocity(currentVelocity)

      // Determine direction
      if (scrollDelta > 0) {
        setDirection("down")
      } else if (scrollDelta < 0) {
        setDirection("up")
      }

      // Calculate scroll progress (0-1)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? currentScrollY / docHeight : 0
      setScrollProgress(Math.min(Math.max(progress, 0), 1))

      setScrollY(currentScrollY)
      setIsScrolling(true)

      // Update document attribute for CSS selectors and other consumers
      try {
        if (typeof document !== "undefined") {
          const dir = scrollDelta > 0 ? "down" : scrollDelta < 0 ? "up" : null
          if (dir) {
            document.documentElement.setAttribute("data-scroll-direction", dir)
          } else {
            document.documentElement.removeAttribute("data-scroll-direction")
          }
          if (isScrolling) {
            document.documentElement.setAttribute("data-is-scrolling", "true")
          } else {
            document.documentElement.removeAttribute("data-is-scrolling")
          }
        }
      } catch (e) {
        // ignore server or CSP errors
      }

      // Dispatch a custom event so components can subscribe if needed
      try {
        const detail = { direction: scrollDelta > 0 ? "down" : scrollDelta < 0 ? "up" : null, scrollY: currentScrollY, velocity: currentVelocity }
        const evt = new CustomEvent("scroll-direction", { detail })
        window.dispatchEvent(evt)
      } catch (e) {
        // Ignore if CustomEvent is unavailable
      }
      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // Set scrolling to false after scroll ends
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)

      lastScrollY.current = currentScrollY
      lastTime.current = currentTime
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  return (
    <ScrollDirectionContext.Provider value={{ direction, scrollY, scrollProgress, velocity, isScrolling }}>
      {children}
    </ScrollDirectionContext.Provider>
  )
}

export function useScrollDirection() {
  return useContext(ScrollDirectionContext)
}
