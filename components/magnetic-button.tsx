"use client"

import { useMagnetic } from "@/lib/animation-system"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface MagneticButtonProps extends ButtonProps {
  strength?: number
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, strength = 0.3, className, ...props }, forwardedRef) => {
    const { ref, style } = useMagnetic(strength)

    return (
      <div ref={ref} style={style} className="inline-block">
        <Button ref={forwardedRef} className={cn("magnetic", className)} {...props}>
          {children}
        </Button>
      </div>
    )
  },
)
MagneticButton.displayName = "MagneticButton"
