"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type LocalizedString = { en: string; ar: string }

type PoliciesContent = {
  intro: LocalizedString
  commitmentsEn: string[]
  commitmentsAr: string[]
}

function splitLines(input: string) {
  return input
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

function joinLines(lines: string[]) {
  return (lines || []).join("\n")
}

export default function PoliciesEditor({ initialPolicies }: { initialPolicies: PoliciesContent }) {
  const [policies, setPolicies] = useState<PoliciesContent>(initialPolicies)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const currentRes = await fetch("/api/admin/site-content", { cache: "no-store" })
      if (!currentRes.ok) throw new Error("Failed to load current content")
      const current = (await currentRes.json()) as any
      current.policies = policies

      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      })
      if (!res.ok) throw new Error("Save failed")
      setMessage("Saved.")
    } catch {
      setMessage("Could not save changes.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Policies</h1>
          <p className="text-muted-foreground mt-2">Edit bilingual policies content.</p>
        </div>
        <Button className="rounded-none h-10" onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      <div className="border border-border/60 p-6 space-y-8">
        <div className="space-y-3">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Intro</p>

          <Label className="text-xs tracking-[0.15em] uppercase">Intro (EN)</Label>
          <Textarea
            value={policies.intro.en}
            onChange={(e) => setPolicies((prev) => ({ ...prev, intro: { ...prev.intro, en: e.target.value } }))}
            className="rounded-none border-foreground/20 resize-none"
            rows={4}
          />

          <Label className="text-xs tracking-[0.15em] uppercase">Intro (AR)</Label>
          <Textarea
            value={policies.intro.ar}
            onChange={(e) => setPolicies((prev) => ({ ...prev, intro: { ...prev.intro, ar: e.target.value } }))}
            className="rounded-none border-foreground/20 resize-none"
            rows={4}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Commitments (EN)</p>
            <Textarea
              value={joinLines(policies.commitmentsEn)}
              onChange={(e) => setPolicies((prev) => ({ ...prev, commitmentsEn: splitLines(e.target.value) }))}
              className="rounded-none border-foreground/20 resize-none"
              rows={12}
            />
            <p className="text-xs text-muted-foreground">One item per line.</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Commitments (AR)</p>
            <Textarea
              value={joinLines(policies.commitmentsAr)}
              onChange={(e) => setPolicies((prev) => ({ ...prev, commitmentsAr: splitLines(e.target.value) }))}
              className="rounded-none border-foreground/20 resize-none"
              rows={12}
            />
            <p className="text-xs text-muted-foreground">عنصر في كل سطر.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

