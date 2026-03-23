"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"

type Theme = "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const noopToggleTheme = () => {}
const noopSetTheme = (_theme: Theme) => {}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const fixedLightTheme: ThemeContextType = {
  theme: "light",
  toggleTheme: noopToggleTheme,
  setTheme: noopSetTheme,
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    localStorage.setItem("act-theme", "light")
    document.documentElement.classList.remove("dark")
    document.documentElement.classList.add("light")
    document.documentElement.style.colorScheme = "light"
  }, [])

  return <ThemeContext.Provider value={fixedLightTheme}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
