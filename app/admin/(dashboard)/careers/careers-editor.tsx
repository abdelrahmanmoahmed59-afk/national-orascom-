"use client"

import { useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { SiteContent } from "@/lib/site-content/schema"

type JobOpening = SiteContent["careers"]["jobs"][number]
type CareersSection = SiteContent["careers"]

function splitLines(input: string) {
  return input
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

function joinLines(lines: string[]) {
  return (lines || []).join("\n")
}

export default function CareersEditor({ initialCareers }: { initialCareers: CareersSection }) {
  const [applyEmail, setApplyEmail] = useState(initialCareers.applyEmail)
  const [jobs, setJobs] = useState<JobOpening[]>(initialCareers.jobs)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function updateJob(slug: string, patch: Partial<JobOpening> | ((prev: JobOpening) => JobOpening)) {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.slug !== slug) return job
        return typeof patch === "function" ? patch(job) : { ...job, ...patch }
      }),
    )
  }

  function addJob() {
    const slug =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `job-${Date.now()}`

    setJobs((prev) => [
      ...prev,
      {
        slug,
        titleEn: "New Position",
        titleAr: "وظيفة جديدة",
        locationEn: "Kuwait",
        locationAr: "الكويت",
        typeEn: "Full-time",
        typeAr: "دوام كامل",
        summaryEn: "",
        summaryAr: "",
        responsibilitiesEn: [],
        responsibilitiesAr: [],
        requirementsEn: [],
        requirementsAr: [],
      },
    ])
  }

  function deleteJob(slug: string) {
    setJobs((prev) => prev.filter((job) => job.slug !== slug))
  }

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const currentRes = await fetch("/api/admin/site-content", { cache: "no-store" })
      if (!currentRes.ok) throw new Error("Failed to load current content")
      const current = (await currentRes.json()) as any
      current.careers = { applyEmail, jobs }

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

  const duplicatedSlugs = new Set(
    jobs
      .map((j) => j.slug.trim())
      .filter(Boolean)
      .filter((slug, index, list) => list.indexOf(slug) !== index),
  )

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Careers</h1>
          <p className="text-muted-foreground mt-2">Manage job openings and application contact email.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none h-10" onClick={addJob}>
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
          <Button className="rounded-none h-10" onClick={save} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      {duplicatedSlugs.size > 0 && (
        <p className="text-sm text-destructive">
          Duplicate job slugs found: {Array.from(duplicatedSlugs).join(", ")}. Slugs must be unique.
        </p>
      )}

      <div className="border border-border/60 p-6 space-y-3">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Apply Email</p>
        <div className="space-y-2">
          <Label className="text-xs tracking-[0.15em] uppercase">Email address</Label>
          <Input
            value={applyEmail}
            onChange={(e) => setApplyEmail(e.target.value)}
            className="rounded-none h-11 border-foreground/20"
            placeholder="careers@company.com"
          />
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="border border-border/60 p-8 text-muted-foreground">
          No jobs yet. Click <span className="font-medium">Add Job</span> to create your first opening.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <details key={job.slug} className="group border border-border/60 bg-background/50">
              <summary className="cursor-pointer list-none p-6 lg:p-8 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">{job.slug}</p>
                  <h2 className="font-serif text-2xl mt-2">{job.titleEn || "Untitled"}</h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none h-10"
                  onClick={(e) => {
                    e.preventDefault()
                    deleteJob(job.slug)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </summary>

              <div className="px-6 lg:px-8 pb-8 space-y-10">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Slug</Label>
                      <Input
                        value={job.slug}
                        onChange={(e) => {
                          const nextSlug = e.target.value
                          setJobs((prev) => prev.map((j) => (j.slug === job.slug ? { ...j, slug: nextSlug } : j)))
                        }}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs tracking-[0.15em] uppercase">Title (EN)</Label>
                        <Input
                          value={job.titleEn}
                          onChange={(e) => updateJob(job.slug, { titleEn: e.target.value })}
                          className="rounded-none h-11 border-foreground/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-[0.15em] uppercase">Title (AR)</Label>
                        <Input
                          value={job.titleAr}
                          onChange={(e) => updateJob(job.slug, { titleAr: e.target.value })}
                          className="rounded-none h-11 border-foreground/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-[0.15em] uppercase">Location (EN)</Label>
                        <Input
                          value={job.locationEn}
                          onChange={(e) => updateJob(job.slug, { locationEn: e.target.value })}
                          className="rounded-none h-11 border-foreground/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-[0.15em] uppercase">Location (AR)</Label>
                        <Input
                          value={job.locationAr}
                          onChange={(e) => updateJob(job.slug, { locationAr: e.target.value })}
                          className="rounded-none h-11 border-foreground/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-[0.15em] uppercase">Type (EN)</Label>
                        <Input
                          value={job.typeEn}
                          onChange={(e) => updateJob(job.slug, { typeEn: e.target.value })}
                          className="rounded-none h-11 border-foreground/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-[0.15em] uppercase">Type (AR)</Label>
                        <Input
                          value={job.typeAr}
                          onChange={(e) => updateJob(job.slug, { typeAr: e.target.value })}
                          className="rounded-none h-11 border-foreground/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Summary (EN)</Label>
                      <Textarea
                        value={job.summaryEn}
                        onChange={(e) => updateJob(job.slug, { summaryEn: e.target.value })}
                        rows={4}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Summary (AR)</Label>
                      <Textarea
                        value={job.summaryAr}
                        onChange={(e) => updateJob(job.slug, { summaryAr: e.target.value })}
                        rows={4}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Responsibilities (EN) – one per line</Label>
                      <Textarea
                        value={joinLines(job.responsibilitiesEn)}
                        onChange={(e) => updateJob(job.slug, { responsibilitiesEn: splitLines(e.target.value) })}
                        rows={8}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Responsibilities (AR) – one per line</Label>
                      <Textarea
                        value={joinLines(job.responsibilitiesAr)}
                        onChange={(e) => updateJob(job.slug, { responsibilitiesAr: splitLines(e.target.value) })}
                        rows={8}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Requirements (EN) – one per line</Label>
                      <Textarea
                        value={joinLines(job.requirementsEn)}
                        onChange={(e) => updateJob(job.slug, { requirementsEn: splitLines(e.target.value) })}
                        rows={8}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Requirements (AR) – one per line</Label>
                      <Textarea
                        value={joinLines(job.requirementsAr)}
                        onChange={(e) => updateJob(job.slug, { requirementsAr: splitLines(e.target.value) })}
                        rows={8}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}

