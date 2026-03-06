"use client"

import { useMemo, useState } from "react"
import { Copy, Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ProjectItem } from "@/lib/site-content/schema"

type ProjectDraft = ProjectItem & {
  editorId: string
}

function slugify(input: string) {
  return (input || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
}

function makeUniqueSlug(base: string, projects: ProjectDraft[], currentSlug: string) {
  const normalizedBase = slugify(base)
  if (!normalizedBase) return currentSlug || `project-${Date.now()}`

  const taken = new Set(
    projects
      .map((p) => p.slug.trim())
      .filter(Boolean)
      .filter((s) => s !== currentSlug.trim()),
  )

  if (!taken.has(normalizedBase)) return normalizedBase
  for (let i = 2; i < 5000; i++) {
    const candidate = `${normalizedBase}-${i}`
    if (!taken.has(candidate)) return candidate
  }
  return `${normalizedBase}-${Date.now()}`
}

function parseAmount(value: string) {
  const cleaned = value.replaceAll(",", "").trim()
  if (!cleaned) return undefined
  const num = Number(cleaned)
  if (!Number.isFinite(num)) return undefined
  return num
}

export default function TableProjectsEditor({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [projects, setProjects] = useState<ProjectDraft[]>(() =>
    (initialProjects || []).map((project, index) => {
      const editorId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `project-${Date.now()}-${index}`
      return { ...project, editorId }
    }),
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const duplicatedSlugs = useMemo(() => {
    const slugs = projects.map((p) => p.slug.trim()).filter(Boolean)
    return new Set(slugs.filter((slug, i) => slugs.indexOf(slug) !== i))
  }, [projects])

  function updateProject(editorId: string, patch: Partial<ProjectDraft> | ((prev: ProjectDraft) => ProjectDraft)) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.editorId !== editorId) return p
        return typeof patch === "function" ? patch(p) : { ...p, ...patch }
      }),
    )
  }

  function addProject() {
    const editorId =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `project-${Date.now()}`
    setProjects((prev) => {
      const titleEn = "New Project"
      const slug = makeUniqueSlug(titleEn, prev, "")
      const nowYear = new Date().getFullYear().toString()
      return [
        ...prev,
        {
          editorId,
          slug,
          titleEn,
          titleAr: "مشروع جديد",
          clientEn: "",
          clientAr: "",
          categoryEn: "Category",
          categoryAr: "تصنيف",
          locationEn: "Kuwait",
          locationAr: "الكويت",
          year: nowYear,
          amountKd: undefined,
          statusEn: "",
          statusAr: "",
          summaryEn: "",
          summaryAr: "",
          detailsEn: "",
          detailsAr: "",
          scopeEn: [],
          scopeAr: [],
          highlightsEn: [],
          highlightsAr: [],
          heroImageUrl: "/placeholder.jpg",
          galleryImageUrls: [],
        },
      ]
    })
  }

  function deleteProject(editorId: string) {
    setProjects((prev) => prev.filter((p) => p.editorId !== editorId))
  }

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const currentRes = await fetch("/api/admin/site-content", { cache: "no-store" })
      if (!currentRes.ok) throw new Error("Failed to load current content")
      const current = (await currentRes.json()) as any
      current.projects = projects.map(({ editorId, ...rest }) => rest)

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

  const jsonOutput = useMemo(() => {
    const rows = projects.map((p, index) => ({
      sn: index + 1,
      slug: p.slug,
      name: { en: p.titleEn, ar: p.titleAr },
      client: { en: p.clientEn, ar: p.clientAr },
      location: { en: p.locationEn, ar: p.locationAr },
      typeOfWork: { en: p.categoryEn, ar: p.categoryAr },
      year: p.year,
      amountKd: p.amountKd,
      status: { en: p.statusEn, ar: p.statusAr },
    }))
    return JSON.stringify(rows, null, 2)
  }, [projects])

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(jsonOutput)
      setMessage("JSON copied.")
    } catch {
      setMessage("Could not copy JSON.")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Table Projects</h1>
          <p className="text-muted-foreground mt-2">Manage the project table columns (client, amount, status, etc.).</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none h-10" onClick={addProject}>
            <Plus className="h-4 w-4 mr-2" />
            Add
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
          Duplicate project slugs found: {Array.from(duplicatedSlugs).join(", ")}. Slugs should be unique.
        </p>
      )}

      <div className="space-y-4">
        {projects.map((project, index) => (
          <details key={project.editorId} className="group border border-border/60 bg-background/50">
            <summary className="cursor-pointer list-none p-6 lg:p-8 flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  #{index + 1} • {project.slug}
                </p>
                <h2 className="font-serif text-2xl mt-2">{project.titleEn || "Untitled"}</h2>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-none h-10 shrink-0"
                onClick={(e) => {
                  e.preventDefault()
                  deleteProject(project.editorId)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </summary>

            <div className="px-6 lg:px-8 pb-8 space-y-10">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Slug</Label>
                      <Input value={project.slug} readOnly className="rounded-none h-11 border-foreground/20" />
                      <p className="text-xs text-muted-foreground">Edit the slug in the main Projects editor.</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Year</Label>
                      <Input
                        value={project.year}
                        onChange={(e) => updateProject(project.editorId, { year: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Amount (KD)</Label>
                      <Input
                        inputMode="decimal"
                        placeholder="e.g. 250000"
                        value={typeof project.amountKd === "number" ? String(project.amountKd) : ""}
                        onChange={(e) => updateProject(project.editorId, { amountKd: parseAmount(e.target.value) })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Name (EN)</Label>
                      <Input
                        value={project.titleEn}
                        onChange={(e) => updateProject(project.editorId, { titleEn: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Name (AR)</Label>
                      <Input
                        value={project.titleAr}
                        onChange={(e) => updateProject(project.editorId, { titleAr: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Client (EN)</Label>
                      <Input
                        value={project.clientEn}
                        onChange={(e) => updateProject(project.editorId, { clientEn: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Client (AR)</Label>
                      <Input
                        value={project.clientAr}
                        onChange={(e) => updateProject(project.editorId, { clientAr: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Status (EN)</Label>
                      <Input
                        value={project.statusEn}
                        onChange={(e) => updateProject(project.editorId, { statusEn: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                        placeholder="Completed / On Progress"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Status (AR)</Label>
                      <Input
                        value={project.statusAr}
                        onChange={(e) => updateProject(project.editorId, { statusAr: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                        placeholder="مكتمل / قيد التنفيذ"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Location (EN)</Label>
                      <Input
                        value={project.locationEn}
                        onChange={(e) => updateProject(project.editorId, { locationEn: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Location (AR)</Label>
                      <Input
                        value={project.locationAr}
                        onChange={(e) => updateProject(project.editorId, { locationAr: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Type of work (EN)</Label>
                      <Input
                        value={project.categoryEn}
                        onChange={(e) => updateProject(project.editorId, { categoryEn: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Type of work (AR)</Label>
                      <Input
                        value={project.categoryAr}
                        onChange={(e) => updateProject(project.editorId, { categoryAr: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="border border-border/60 bg-background/40 p-6 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-serif text-xl">JSON Output</h2>
            <p className="text-sm text-muted-foreground">Copy/paste the table rows as JSON.</p>
          </div>
          <Button variant="outline" className="rounded-none h-10" onClick={copyJson}>
            <Copy className="h-4 w-4 mr-2" />
            Copy JSON
          </Button>
        </div>
        <Textarea value={jsonOutput} readOnly rows={14} className="rounded-none border-foreground/20 font-mono text-xs" />
      </div>
    </div>
  )
}

