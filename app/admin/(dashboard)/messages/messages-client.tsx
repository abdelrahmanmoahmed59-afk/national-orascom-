"use client"

import { useMemo, useState } from "react"
import { RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ContactSubmission } from "@/lib/contact-submissions/schema"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export default function MessagesClient({ initialMessages }: { initialMessages: ContactSubmission[] }) {
  const [messages, setMessages] = useState<ContactSubmission[]>(initialMessages)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const sorted = useMemo(() => {
    return [...messages].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
  }, [messages])

  async function refresh() {
    setRefreshing(true)
    setNotice(null)
    try {
      const res = await fetch("/api/admin/messages", { cache: "no-store" })
      if (!res.ok) throw new Error("failed")
      const json = (await res.json()) as ContactSubmission[]
      setMessages(json)
    } catch {
      setNotice("Could not refresh.")
    } finally {
      setRefreshing(false)
    }
  }

  async function remove(id: string) {
    setBusyId(id)
    setNotice(null)
    try {
      const res = await fetch(`/api/admin/messages/${encodeURIComponent(id)}`, { method: "DELETE" })
      if (!res.ok) throw new Error("failed")
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } catch {
      setNotice("Could not delete.")
    } finally {
      setBusyId(null)
    }
  }

  async function clearAll() {
    if (!confirm("Delete all contact messages?")) return
    setClearing(true)
    setNotice(null)
    try {
      const res = await fetch("/api/admin/messages", { method: "DELETE" })
      if (!res.ok) throw new Error("failed")
      setMessages([])
    } catch {
      setNotice("Could not clear.")
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Contact Messages</h1>
          <p className="text-muted-foreground mt-2">Submissions from the Contact form.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none h-10" onClick={refresh} disabled={refreshing}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
          <Button variant="outline" className="rounded-none h-10" onClick={clearAll} disabled={clearing || messages.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            {clearing ? "Clearing…" : "Clear all"}
          </Button>
        </div>
      </div>

      {notice && <p className="text-sm text-muted-foreground">{notice}</p>}

      {sorted.length === 0 ? (
        <div className="border border-border/60 p-8 text-muted-foreground">No messages yet.</div>
      ) : (
        <div className="space-y-3">
          {sorted.map((m) => (
            <details key={m.id} className="group border border-border/60 bg-background/50">
              <summary className="cursor-pointer list-none p-6 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    {formatDate(m.createdAt)}
                    {m.sourcePath ? ` • ${m.sourcePath}` : ""}
                  </p>
                  <h2 className="font-serif text-xl mt-2 truncate">{m.subject}</h2>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {m.name} • {m.email}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none h-10 shrink-0"
                  onClick={(e) => {
                    e.preventDefault()
                    remove(m.id)
                  }}
                  disabled={busyId === m.id}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {busyId === m.id ? "Deleting…" : "Delete"}
                </Button>
              </summary>

              <div className="px-6 pb-8 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Email</p>
                    <a className="hover:underline" href={`mailto:${m.email}`}>
                      {m.email}
                    </a>
                  </div>
                  {m.phone && (
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Phone</p>
                      <a className="hover:underline" href={`tel:${m.phone}`}>
                        {m.phone}
                      </a>
                    </div>
                  )}
                  {m.company && (
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Company</p>
                      <p>{m.company}</p>
                    </div>
                  )}
                </div>

                <div className="border border-border/60 bg-background/40 p-4 whitespace-pre-wrap text-sm text-muted-foreground">
                  {m.message}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}

