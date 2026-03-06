"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize scroll animations observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Observe all scroll-animate elements
    const elements = document.querySelectorAll(".scroll-animate, .stagger")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return <div ref={scrollRef}>{children}</div>
}
