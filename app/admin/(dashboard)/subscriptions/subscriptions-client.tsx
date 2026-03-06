"use client"

import { useMemo, useState } from "react"
import { RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NewsletterSubscription } from "@/lib/newsletter-subscriptions/schema"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export default function SubscriptionsClient({
  initialSubscriptions,
}: {
  initialSubscriptions: NewsletterSubscription[]
}) {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>(initialSubscriptions)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const sorted = useMemo(() => {
    return [...subscriptions].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
  }, [subscriptions])

  async function refresh() {
    setRefreshing(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/subscriptions", { cache: "no-store" })
      if (!res.ok) throw new Error("failed")
      const json = (await res.json()) as NewsletterSubscription[]
      setSubscriptions(json)
    } catch {
      setMessage("Could not refresh.")
    } finally {
      setRefreshing(false)
    }
  }

  async function remove(id: string) {
    setBusyId(id)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/subscriptions/${encodeURIComponent(id)}`, { method: "DELETE" })
      if (!res.ok) throw new Error("failed")
      setSubscriptions((prev) => prev.filter((s) => s.id !== id))
    } catch {
      setMessage("Could not delete.")
    } finally {
      setBusyId(null)
    }
  }

  async function clearAll() {
    if (!confirm("Delete all subscriptions?")) return
    setClearing(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/subscriptions", { method: "DELETE" })
      if (!res.ok) throw new Error("failed")
      setSubscriptions([])
    } catch {
      setMessage("Could not clear.")
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Subscriptions</h1>
          <p className="text-muted-foreground mt-2">Newsletter signups from the footer form.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none h-10" onClick={refresh} disabled={refreshing}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
          <Button
            variant="outline"
            className="rounded-none h-10"
            onClick={clearAll}
            disabled={clearing || subscriptions.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {clearing ? "Clearing…" : "Clear all"}
          </Button>
        </div>
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      {sorted.length === 0 ? (
        <div className="border border-border/60 p-8 text-muted-foreground">No subscriptions yet.</div>
      ) : (
        <div className="border border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Source</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr key={s.id} className="border-t border-border/60">
                    <td className="p-3 whitespace-nowrap text-muted-foreground">{formatDate(s.createdAt)}</td>
                    <td className="p-3">
                      <a className="hover:underline" href={`mailto:${s.email}`}>
                        {s.email}
                      </a>
                    </td>
                    <td className="p-3 text-muted-foreground">{s.sourcePath || "—"}</td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        className="rounded-none h-9"
                        onClick={() => remove(s.id)}
                        disabled={busyId === s.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {busyId === s.id ? "Deleting…" : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

