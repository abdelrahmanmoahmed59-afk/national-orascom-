"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, Wrench, Building2, Briefcase, Info, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/language-context"
import { searchItems, type SearchItem } from "@/lib/search-data"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeIcons = {
  page: FileText,
  service: Wrench,
  project: Building2,
  career: Briefcase,
  info: Info,
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { language, t, dir } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (query.trim()) {
      const items = searchItems(query, language)
      setResults(items)
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query, language])

  const handleSelect = useCallback(
    (item: SearchItem) => {
      router.push(item.href)
      onOpenChange(false)
      setQuery("")
    },
    [router, onOpenChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === "Enter" && results[selectedIndex]) {
        handleSelect(results[selectedIndex])
      }
    },
    [results, selectedIndex, handleSelect],
  )

  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden" dir={dir}>
        <VisuallyHidden>
          <DialogTitle>{t.nav.search}</DialogTitle>
        </VisuallyHidden>
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.nav.searchPlaceholder}
            className="border-0 focus-visible:ring-0 text-lg h-14"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 hover:bg-muted rounded-md transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((item, index) => {
              const Icon = typeIcons[item.type]
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-start transition-colors",
                    index === selectedIndex ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title[language]}</p>
                    <p
                      className={cn(
                        "text-sm truncate",
                        index === selectedIndex ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      {item.description[language]}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded capitalize",
                      index === selectedIndex ? "bg-primary-foreground/20" : "bg-muted",
                    )}
                  >
                    {item.type}
                  </span>
                </button>
              )
            })}
          </div>
        )}
        {query && results.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">{t.common.noResults}</div>
        )}
        {!query && (
          <div className="p-8 text-center text-muted-foreground">
            {language === "en" ? "Start typing to search..." : "ابدأ الكتابة للبحث..."}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
