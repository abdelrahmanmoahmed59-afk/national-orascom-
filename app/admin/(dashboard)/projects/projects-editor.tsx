"use client"

import { useRef, useState } from "react"
import { Plus, Save, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ProjectItem } from "@/lib/site-content/schema"

type ProjectDraft = ProjectItem & {
  editorId: string
  slugMode: "auto" | "manual"
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

function isPlaceholderSlug(slug: string) {
  const value = (slug || "").trim()
  if (!value) return true
  if (/^project-\d+$/i.test(value)) return true
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return true
  return false
}

function makeUniqueSlug(base: string, projects: ProjectItem[], currentSlug: string) {
  const normalizedBase = slugify(base)
  if (!normalizedBase) return currentSlug

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

function shouldAutoSlug(project: ProjectItem) {
  const slug = (project.slug || "").trim()
  const title = (project.titleEn || "").trim()
  if (isPlaceholderSlug(slug)) return true
  if (!title) return false
  if (slug === title) return true
  if (slug === slugify(title)) return true
  return false
}

function normalizeAutoSlugs(projects: ProjectDraft[]) {
  const taken = new Set<string>()
  for (const project of projects) {
    if (project.slugMode !== "manual") continue
    const value = (project.slug || "").trim()
    if (value) taken.add(value)
  }

  return projects.map((project) => {
    if (project.slugMode === "manual") return project

    const base =
      slugify(project.titleEn) || slugify(project.slug) || slugify(project.editorId) || `project-${Date.now()}`
    if (!base) return project

    let nextSlug = base
    if (taken.has(nextSlug)) {
      for (let i = 2; i < 5000; i++) {
        const candidate = `${base}-${i}`
        if (!taken.has(candidate)) {
          nextSlug = candidate
          break
        }
      }
      if (taken.has(nextSlug)) {
        nextSlug = `${base}-${Date.now()}`
      }
    }

    taken.add(nextSlug)
    if (nextSlug === project.slug) return project
    return { ...project, slug: nextSlug }
  })
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

export default function ProjectsEditor({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [projects, setProjects] = useState<ProjectDraft[]>(() =>
    normalizeAutoSlugs(
      (initialProjects || []).map((project, index) => {
        const editorId =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `project-${Date.now()}-${index}`
        return {
          ...project,
          editorId,
          slugMode: shouldAutoSlug(project) ? "auto" : "manual",
        }
      }),
    ),
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const heroInput = useRef<Record<string, HTMLInputElement | null>>({})
  const galleryInput = useRef<Record<string, HTMLInputElement | null>>({})

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

    setProjects((prev) => [
      ...prev,
      {
        editorId,
        slugMode: "auto",
        slug: makeUniqueSlug("New Project", prev, ""),
        titleEn: "New Project",
        titleAr: "مشروع جديد",
        clientEn: "",
        clientAr: "",
        categoryEn: "Category",
        categoryAr: "تصنيف",
        locationEn: "Kuwait",
        locationAr: "الكويت",
        year: new Date().getFullYear().toString(),
        amountKd: undefined,
        statusEn: "",
        statusAr: "",
        showInProjectsTable: true,
        showInProjectsDropdown: true,
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
    ])
  }

  function deleteProject(editorId: string) {
    setProjects((prev) => prev.filter((p) => p.editorId !== editorId))
  }

  async function uploadImage(file: File, folder: "projects") {
    const form = new FormData()
    form.set("folder", folder)
    form.set("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: form })
    if (!res.ok) throw new Error("Upload failed")
    const json = (await res.json()) as { src: string }
    return json.src
  }

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const hasEmptySlug = projects.some((p) => !p.slug.trim())
      if (hasEmptySlug || duplicatedSlugs.size > 0) {
        setMessage("Please fix slug issues before saving.")
        return
      }

      const currentRes = await fetch("/api/admin/site-content", { cache: "no-store" })
      if (!currentRes.ok) throw new Error("Failed to load current content")
      const current = (await currentRes.json()) as any
      current.projects = projects.map(({ editorId, slugMode, ...rest }) => rest)

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
    projects
      .map((p) => p.slug.trim())
      .filter(Boolean)
      .filter((slug, index, list) => list.indexOf(slug) !== index),
  )

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Projects</h1>
          <p className="text-muted-foreground mt-2">Edit bilingual project details, hero images, and galleries.</p>
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
          Duplicate project slugs found: {Array.from(duplicatedSlugs).join(", ")}. Slugs must be unique.
        </p>
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <details key={project.editorId} className="group border border-border/60 bg-background/50">
            <summary className="cursor-pointer list-none p-6 lg:p-8 flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">{project.slug}</p>
                <h2 className="font-serif text-2xl mt-2">{project.titleEn || "Untitled"}</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none h-10"
                  onClick={(e) => {
                    e.preventDefault()
                    deleteProject(project.editorId)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </summary>

            <div className="px-6 lg:px-8 pb-8 space-y-10">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs tracking-[0.15em] uppercase">Slug</Label>
                        {project.slugMode === "auto" ? (
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-xs"
                            onClick={() => updateProject(project.editorId, { slugMode: "manual" })}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-xs"
                            onClick={() =>
                              setProjects((prev) =>
                                prev.map((p) => {
                                  if (p.editorId !== project.editorId) return p
                                  return {
                                    ...p,
                                    slugMode: "auto",
                                    slug: makeUniqueSlug(p.titleEn, prev, p.slug),
                                  }
                                }),
                              )
                            }
                          >
                            Auto
                          </Button>
                        )}
                      </div>
                      <Input
                        value={project.slug}
                        readOnly={project.slugMode === "auto"}
                        onChange={(e) => {
                          if (project.slugMode === "auto") return
                          const nextSlug = slugify(e.target.value)
                          setProjects((prev) =>
                            prev.map((p) => (p.editorId === project.editorId ? { ...p, slug: nextSlug } : p)),
                          )
                        }}
                        className="rounded-none h-11 border-foreground/20"
                      />
                      {project.slugMode === "auto" && (
                        <p className="text-xs text-muted-foreground">Auto-generated from Title (EN).</p>
                      )}
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
                      <Label className="text-xs tracking-[0.15em] uppercase">Category (EN)</Label>
                      <Input
                        value={project.categoryEn}
                        onChange={(e) => updateProject(project.editorId, { categoryEn: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Category (AR)</Label>
                      <Input
                        value={project.categoryAr}
                        onChange={(e) => updateProject(project.editorId, { categoryAr: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
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
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Visibility</Label>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-1">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={project.showInProjectsTable}
                            onChange={(e) => updateProject(project.editorId, { showInProjectsTable: e.target.checked })}
                            className="h-4 w-4 accent-primary"
                          />
                          Show in Projects table
                        </label>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={project.showInProjectsDropdown}
                            onChange={(e) =>
                              updateProject(project.editorId, { showInProjectsDropdown: e.target.checked })
                            }
                            className="h-4 w-4 accent-primary"
                          />
                          Show in Projects dropdown
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Title (EN)</Label>
                      <Input
                        value={project.titleEn}
                        onChange={(e) => {
                          const nextTitleEn = e.target.value
                          setProjects((prev) =>
                            prev.map((p) => {
                              if (p.editorId !== project.editorId) return p

                              if (p.slugMode !== "auto") return { ...p, titleEn: nextTitleEn }

                              const nextSlug = makeUniqueSlug(nextTitleEn, prev, p.slug)

                              return { ...p, titleEn: nextTitleEn, slug: nextSlug }
                            }),
                          )
                        }}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Title (AR)</Label>
                      <Input
                        value={project.titleAr}
                        onChange={(e) => updateProject(project.editorId, { titleAr: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Summary (EN)</Label>
                      <Textarea
                        value={project.summaryEn}
                        onChange={(e) => updateProject(project.editorId, { summaryEn: e.target.value })}
                        rows={4}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Summary (AR)</Label>
                      <Textarea
                        value={project.summaryAr}
                        onChange={(e) => updateProject(project.editorId, { summaryAr: e.target.value })}
                        rows={4}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Details (EN)</Label>
                      <Textarea
                        value={project.detailsEn ?? ""}
                        onChange={(e) => updateProject(project.editorId, { detailsEn: e.target.value })}
                        rows={6}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Details (AR)</Label>
                      <Textarea
                        value={project.detailsAr ?? ""}
                        onChange={(e) => updateProject(project.editorId, { detailsAr: e.target.value })}
                        rows={6}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs tracking-[0.15em] uppercase">Hero image</Label>
                    <div className="aspect-4/3 overflow-hidden border border-border/60 bg-background/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={project.heroImageUrl} alt="" className="w-full h-full object-cover" />
                    </div>

                    <input
                      ref={(el) => {
                        heroInput.current[project.editorId] = el
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const src = await uploadImage(file, "projects")
                          updateProject(project.editorId, { heroImageUrl: src })
                          setMessage("Hero image uploaded.")
                        } catch {
                          setMessage("Hero upload failed.")
                        } finally {
                          e.target.value = ""
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      className="rounded-none h-10 w-full"
                      onClick={() => heroInput.current[project.editorId]?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload hero
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Scope (EN) – one per line</Label>
                      <Textarea
                        value={joinLines(project.scopeEn)}
                        onChange={(e) => updateProject(project.editorId, { scopeEn: splitLines(e.target.value) })}
                        rows={6}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Scope (AR) – one per line</Label>
                      <Textarea
                        value={joinLines(project.scopeAr)}
                        onChange={(e) => updateProject(project.editorId, { scopeAr: splitLines(e.target.value) })}
                        rows={6}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Highlights (EN) – one per line</Label>
                      <Textarea
                        value={joinLines(project.highlightsEn)}
                        onChange={(e) => updateProject(project.editorId, { highlightsEn: splitLines(e.target.value) })}
                        rows={6}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Highlights (AR) – one per line</Label>
                      <Textarea
                        value={joinLines(project.highlightsAr)}
                        onChange={(e) => updateProject(project.editorId, { highlightsAr: splitLines(e.target.value) })}
                        rows={6}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs tracking-[0.15em] uppercase">Gallery</Label>
                    {project.galleryImageUrls.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No gallery images yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {project.galleryImageUrls.map((src, idx) => (
                          <div key={`${project.editorId}-${idx}`} className="relative border border-border/60 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt="" className="w-full h-28 object-cover" />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-background/80 border border-border px-2 py-1 text-xs"
                              onClick={() =>
                                updateProject(project.editorId, (prev) => ({
                                  ...prev,
                                  galleryImageUrls: prev.galleryImageUrls.filter((_, i) => i !== idx),
                                }))
                              }
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <input
                      ref={(el) => {
                        galleryInput.current[project.editorId] = el
                      }}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || [])
                        if (files.length === 0) return
                        try {
                          const uploaded: string[] = []
                            for (const file of files) {
                              uploaded.push(await uploadImage(file, "projects"))
                            }
                            updateProject(project.editorId, (prev) => ({
                              ...prev,
                              galleryImageUrls: [...prev.galleryImageUrls, ...uploaded],
                            }))
                            setMessage("Gallery images uploaded.")
                          } catch {
                          setMessage("Gallery upload failed.")
                        } finally {
                          e.target.value = ""
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      className="rounded-none h-10 w-full"
                      onClick={() => galleryInput.current[project.editorId]?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload gallery images
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
