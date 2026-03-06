"use client"

import Image from "next/image"
import React from "react"

export function AnimatedLogoImage({ width = 160, height = 60, className = "" }: { width?: number; height?: number; className?: string }) {
    return (
        <div className={`animated-logo-image ${className}`}>
            <img src="/icon.svg" width={width} height={height} alt="National Orascom" />
        </div>
    )
}
