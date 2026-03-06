"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"

export function ScrollToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 400)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <button
            type="button"
            aria-label="Scroll to top"
            onClick={handleClick}
            className={`fixed right-6 bottom-8 z-50 flex items-center justify-center p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring/60 ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
                } bg-foreground text-background`}
        >
            <ChevronUp className="h-5 w-5" />
        </button>
    )
}
