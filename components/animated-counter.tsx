"use client"

import { useCountUp } from "@/lib/animation-system"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  delay?: number
  className?: string
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
  delay = 0,
  className,
}: AnimatedCounterProps) {
  const { ref, count } = useCountUp(value, { duration, delay })

  return (
    <span ref={ref} className={cn("counter-animate tabular-nums", className)}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}
