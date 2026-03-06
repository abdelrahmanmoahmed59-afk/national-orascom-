"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, Sun, Moon, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/language-context"
import { useTheme } from "@/lib/theme-context"
import { SearchDialog } from "@/components/search-dialog"
import { cn } from "@/lib/utils"
import type { ProjectItem, SiteContent } from "@/lib/site-content/schema"

export function Navbar({
  branding,
  projects,
}: {
  branding: SiteContent["branding"]
  projects: ProjectItem[]
}) {
  const { language, setLanguage, t, dir } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const [navHeight, setNavHeight] = useState(72)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      const previous = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = previous
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) setMobileProjectsOpen(false)
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const update = () => {
      if (!navRef.current) return
      setNavHeight(navRef.current.offsetHeight)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    if (!navRef.current) return
    setNavHeight(navRef.current.offsetHeight)
  }, [isScrolled, isOpen])

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/clients", label: t.nav.clients },
    { href: "/careers", label: t.nav.careers },
    { href: "/contact", label: t.nav.contact },
    { href: "/policies", label: t.nav.policies },
  ]

  const isProjectsActive = pathname === "/projects" || pathname.startsWith("/projects/")

  return (
    <>
      <nav
        ref={navRef}
        dir={dir}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          isScrolled ? "bg-background/80 backdrop-blur-xl py-4" : "bg-transparent py-6",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center border border-border/60 bg-background/60 backdrop-blur overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={branding.logo.src}
                  alt={branding.logo.alt[language]}
                  className="h-8 w-8 object-contain"
                />
              </span>
              <div className="leading-tight">
                <div className="font-serif text-lg tracking-tight">{branding.companyName[language]}</div>
                <div className="hidden sm:block text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  {branding.tagline[language]}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className={cn(
                  "text-sm tracking-wide transition-all duration-300 hover-border-reveal pb-1",
                  pathname === "/" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/about"
                className={cn(
                  "text-sm tracking-wide transition-all duration-300 hover-border-reveal pb-1",
                  pathname === "/about" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.nav.about}
              </Link>
              <Link
                href="/services"
                className={cn(
                  "text-sm tracking-wide transition-all duration-300 hover-border-reveal pb-1",
                  pathname === "/services" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.nav.services}
              </Link>

              {/* Projects dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "text-sm tracking-wide transition-all duration-300 hover-border-reveal pb-1 inline-flex items-center gap-2",
                      isProjectsActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
                    )}
                    type="button"
                  >
                    {t.nav.projects}
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-[min(760px,calc(100vw-2rem))] p-2"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/projects" className="cursor-pointer">
                      {language === "en" ? "All Projects" : "جميع المشاريع"}
                    </Link>
                  </DropdownMenuItem>
                  <div className="h-px bg-border my-1" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                    {projects.map((project) => (
                      <DropdownMenuItem
                        key={project.slug}
                        asChild
                        className="flex-col items-start gap-1 h-auto px-3 py-2.5 cursor-pointer text-start"
                      >
                        <Link href={`/projects/${encodeURIComponent(project.slug)}`}>
                          <span className="text-xs text-muted-foreground">
                            {project.year} • {language === "en" ? project.categoryEn : project.categoryAr}
                          </span>
                          <span className="font-medium leading-snug line-clamp-2">
                            {language === "en" ? project.titleEn : project.titleAr}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {navLinks.slice(3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm tracking-wide transition-all duration-300 hover-border-reveal pb-1",
                    pathname === link.href ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="rounded-full w-10 h-10"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">{t.nav.search}</span>
              </Button>

              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full w-10 h-10">
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="min-w-[120px]">
                  <DropdownMenuItem onClick={() => setLanguage("en")} className="cursor-pointer">
                    <span className={language === "en" ? "font-semibold" : ""}>English</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ar")} className="cursor-pointer">
                    <span className={language === "ar" ? "font-semibold" : ""}>العربية</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full w-10 h-10"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Full screen overlay */}
        <div
          className={cn(
            "lg:hidden fixed inset-x-0 bottom-0 bg-background/98 backdrop-blur-xl transition-all duration-500 overflow-y-auto overscroll-contain",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible",
          )}
          style={{ top: navHeight }}
        >
          <div className="min-h-full flex flex-col items-center justify-center gap-8 py-10 pb-20">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-3xl font-serif transition-all duration-500",
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              style={{ transitionDelay: "0ms" }}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-3xl font-serif transition-all duration-500",
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                pathname === "/about" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              style={{ transitionDelay: "75ms" }}
            >
              {t.nav.about}
            </Link>
            <Link
              href="/services"
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-3xl font-serif transition-all duration-500",
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                pathname === "/services" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              style={{ transitionDelay: "150ms" }}
            >
              {t.nav.services}
            </Link>

            <div className={cn("transition-all duration-500", isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")} style={{ transitionDelay: "225ms" }}>
              <button
                type="button"
                onClick={() => setMobileProjectsOpen((v) => !v)}
                className={cn(
                  "text-3xl font-serif inline-flex items-center gap-3",
                  isProjectsActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.nav.projects}
                <ChevronDown className={cn("h-5 w-5 transition-transform", mobileProjectsOpen && "rotate-180")} />
              </button>

              {mobileProjectsOpen && (
                <div className="mt-6 w-[min(760px,calc(100vw-3rem))]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      href="/projects"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "sm:col-span-2 border border-border/60 bg-background/40 hover:bg-muted transition-colors px-4 py-3 text-start",
                        pathname === "/projects" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {language === "en" ? "All Projects" : "جميع المشاريع"}
                    </Link>
                    {projects.map((project) => {
                      const projectHref = `/projects/${encodeURIComponent(project.slug)}`
                      return (
                        <Link
                          key={project.slug}
                          href={projectHref}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "border border-border/60 bg-background/40 hover:bg-muted transition-colors px-4 py-3 text-start",
                            pathname === projectHref ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <div className="text-xs text-muted-foreground">
                            {project.year} • {language === "en" ? project.categoryEn : project.categoryAr}
                          </div>
                          <div className="mt-1 text-sm font-medium leading-snug line-clamp-2">
                            {language === "en" ? project.titleEn : project.titleAr}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(3).map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-3xl font-serif transition-all duration-500",
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                  pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                style={{ transitionDelay: `${300 + index * 75}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
