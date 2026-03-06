"use client"

import { useScrollDirection } from "@/lib/scroll-direction-context"
import { cn } from "@/lib/utils"

interface ScrollProgressBarProps {
  className?: string
  showPercentage?: boolean
  position?: "top" | "bottom"
}

export function ScrollProgressBar({ className, showPercentage = false, position = "top" }: ScrollProgressBarProps) {
  const { scrollProgress, direction, isScrolling } = useScrollDirection()

  return (
    <div
      className={cn("fixed left-0 right-0 z-50 h-1 bg-border/30", position === "top" ? "top-0" : "bottom-0", className)}
    >
      <div
        className={cn(
          "h-full transition-all duration-150 ease-out",
          direction === "up" ? "bg-accent" : "bg-primary",
          isScrolling && "shadow-[0_0_10px_currentColor]",
        )}
        style={{ width: `${scrollProgress * 100}%` }}
      />
      {showPercentage && (
        <span
          className={cn(
            "absolute top-2 text-xs font-mono text-muted-foreground transition-opacity",
            isScrolling ? "opacity-100" : "opacity-0",
          )}
          style={{ left: `${scrollProgress * 100}%`, transform: "translateX(-50%)" }}
        >
          {Math.round(scrollProgress * 100)}%
        </span>
      )}
    </div>
  )
}
