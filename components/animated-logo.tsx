"use client"

import React from "react"

export function AnimatedLogo({ className = "" }: { className?: string }) {
    return (
        <div className={`animated-logo inline-flex items-center gap-3 ${className}`} aria-hidden={false}>
            <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animated-logo__gear"
                aria-hidden="true"
            >
                <title>National Orascom</title>
                <path
                    d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    fill="currentColor"
                    fillOpacity="0.12"
                />
                <g stroke="currentColor" strokeWidth="0.9" fill="none">
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a0.5 0.5 0 01.11.54 9 9 0 01-2.6 2.6 0.5 0.5 0 01-.54-.11l-.06-.06A1.65 1.65 0 0015 19.4" />
                    <path d="M9 4.6A1.65 1.65 0 0010.82 4l.06-.06a0.5 0.5 0 01.54-.11 9 9 0 012.6 2.6 0.5 0.5 0 01-.11.54L13.4 7A1.65 1.65 0 0012 7.6" />
                </g>
            </svg>

            <span className="animated-logo__text font-serif font-semibold tracking-tight">NO</span>
        </div>
    )
}
