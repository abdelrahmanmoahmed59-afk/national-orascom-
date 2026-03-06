"use client"

import { useMemo, useState } from "react"
import { RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { JobApplication } from "@/lib/applications/schema"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export default function ApplicationsClient({ initialApplications }: { initialApplications: JobApplication[] }) {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const sorted = useMemo(() => {
    return [...applications].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
  }, [applications])

  async function refresh() {
    setRefreshing(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/applications", { cache: "no-store" })
      if (!res.ok) throw new Error("failed")
      const json = (await res.json()) as JobApplication[]
      setApplications(json)
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
      const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}`, { method: "DELETE" })
      if (!res.ok) throw new Error("failed")
      setApplications((prev) => prev.filter((a) => a.id !== id))
    } catch {
      setMessage("Could not delete.")
    } finally {
      setBusyId(null)
    }
  }

  async function clearAll() {
    if (!confirm("Delete all job applications?")) return
    setClearing(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/applications", { method: "DELETE" })
      if (!res.ok) throw new Error("failed")
      setApplications([])
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
          <h1 className="font-serif text-3xl">Job Applications</h1>
          <p className="text-muted-foreground mt-2">Submissions from the Careers “Apply” form.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none h-10" onClick={refresh} disabled={refreshing}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
          <Button variant="outline" className="rounded-none h-10" onClick={clearAll} disabled={clearing || applications.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            {clearing ? "Clearing…" : "Clear all"}
          </Button>
        </div>
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      {sorted.length === 0 ? (
        <div className="border border-border/60 p-8 text-muted-foreground">No applications yet.</div>
      ) : (
        <div className="border border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Job</th>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Phone</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((a) => (
                  <tr key={a.id} className="border-t border-border/60">
                    <td className="p-3 whitespace-nowrap text-muted-foreground">{formatDate(a.createdAt)}</td>
                    <td className="p-3">
                      <div className="font-medium">{a.jobTitleEn}</div>
                      <div className="text-muted-foreground">{a.jobSlug}</div>
                    </td>
                    <td className="p-3">{a.applicantName}</td>
                    <td className="p-3">
                      <a className="hover:underline" href={`mailto:${a.applicantEmail}`}>
                        {a.applicantEmail}
                      </a>
                    </td>
                    <td className="p-3">
                      <a className="hover:underline" href={`tel:${a.applicantPhone}`}>
                        {a.applicantPhone}
                      </a>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        className="rounded-none h-9"
                        onClick={() => remove(a.id)}
                        disabled={busyId === a.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {busyId === a.id ? "Deleting…" : "Delete"}
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

