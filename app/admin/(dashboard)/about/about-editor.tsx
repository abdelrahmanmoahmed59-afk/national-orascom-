"use client"

import { useRef, useState } from "react"
import { Plus, Save, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { SiteContent } from "@/lib/site-content/schema"

type AboutContent = SiteContent["about"]
type AboutStat = SiteContent["aboutStats"][number]
type AboutValue = SiteContent["aboutValues"][number]
type AboutCoreValues = SiteContent["aboutCoreValues"]
type AboutMilestone = SiteContent["aboutMilestones"][number]

function linesToItems(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function itemsToLines(items: string[]) {
  return items.join("\n")
}

export default function AboutEditor({
  initialAbout,
  initialStats,
  initialValues,
  initialCoreValues,
  initialMilestones,
}: {
  initialAbout: AboutContent
  initialStats: AboutStat[]
  initialValues: AboutValue[]
  initialCoreValues: AboutCoreValues
  initialMilestones: AboutMilestone[]
}) {
  const [about, setAbout] = useState<AboutContent>(initialAbout)
  const [stats, setStats] = useState<AboutStat[]>(initialStats)
  const [values, setValues] = useState<AboutValue[]>(initialValues)
  const [coreValues, setCoreValues] = useState<AboutCoreValues>(initialCoreValues)
  const [milestones, setMilestones] = useState<AboutMilestone[]>(initialMilestones)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const imageInput = useRef<HTMLInputElement | null>(null)
  const coreValueImageInputs = useRef<Record<string, HTMLInputElement | null>>({})

  async function uploadImage(file: File) {
    const form = new FormData()
    form.set("folder", "about")
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
      const currentRes = await fetch("/api/admin/site-content", { cache: "no-store" })
      if (!currentRes.ok) throw new Error("Failed to load current content")
      const current = (await currentRes.json()) as any
      current.about = about
      current.aboutStats = stats
      current.aboutValues = values
      current.aboutCoreValues = coreValues
      current.aboutMilestones = milestones

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

  function addStat() {
    setStats((prev) => [
      ...prev,
      { value: 0, suffix: "", labelEn: "New stat", labelAr: "إحصائية جديدة" },
    ])
  }

  function addValue() {
    setValues((prev) => [
      ...prev,
      { titleEn: "New value", titleAr: "قيمة جديدة", descEn: "", descAr: "" },
    ])
  }

  function addCoreValue() {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `core-value-${Date.now()}`
    setCoreValues((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id,
          labelEn: "New card",
          labelAr: "بطاقة جديدة",
          imageUrl: "/placeholder.jpg",
          statementEn: "",
          statementAr: "",
          introEn: "",
          introAr: "",
          pointsEn: [],
          pointsAr: [],
        },
      ],
    }))
  }

  function addMilestone() {
    setMilestones((prev) => [...prev, { year: new Date().getFullYear().toString(), titleEn: "New milestone", titleAr: "محطة جديدة" }])
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">About</h1>
          <p className="text-muted-foreground mt-2">
            Edit bilingual about page content, stats, values, core values cards, and milestones.
          </p>
        </div>
        <Button className="rounded-none h-10" onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      {/* Main content */}
      <div className="border border-border/60 p-6 space-y-6">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Main Content</p>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Excerpt (EN)</Label>
              <Textarea
                value={about.excerptEn}
                onChange={(e) => setAbout((prev) => ({ ...prev, excerptEn: e.target.value }))}
                rows={4}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Excerpt (AR)</Label>
              <Textarea
                value={about.excerptAr}
                onChange={(e) => setAbout((prev) => ({ ...prev, excerptAr: e.target.value }))}
                rows={4}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Title (EN)</Label>
              <Input
                value={about.titleEn}
                onChange={(e) => setAbout((prev) => ({ ...prev, titleEn: e.target.value }))}
                className="rounded-none h-11 border-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Title (AR)</Label>
              <Input
                value={about.titleAr}
                onChange={(e) => setAbout((prev) => ({ ...prev, titleAr: e.target.value }))}
                className="rounded-none h-11 border-foreground/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Story Content (EN)</Label>
              <Textarea
                value={about.contentEn}
                onChange={(e) => setAbout((prev) => ({ ...prev, contentEn: e.target.value }))}
                rows={8}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Story Content (AR)</Label>
              <Textarea
                value={about.contentAr}
                onChange={(e) => setAbout((prev) => ({ ...prev, contentAr: e.target.value }))}
                rows={8}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Mission (EN)</Label>
              <Textarea
                value={about.missionEn}
                onChange={(e) => setAbout((prev) => ({ ...prev, missionEn: e.target.value }))}
                rows={3}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Mission (AR)</Label>
              <Textarea
                value={about.missionAr}
                onChange={(e) => setAbout((prev) => ({ ...prev, missionAr: e.target.value }))}
                rows={3}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Vision (EN)</Label>
              <Textarea
                value={about.visionEn}
                onChange={(e) => setAbout((prev) => ({ ...prev, visionEn: e.target.value }))}
                rows={3}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Vision (AR)</Label>
              <Textarea
                value={about.visionAr}
                onChange={(e) => setAbout((prev) => ({ ...prev, visionAr: e.target.value }))}
                rows={3}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Industry (EN)</Label>
              <Textarea
                value={about.industryEn}
                onChange={(e) => setAbout((prev) => ({ ...prev, industryEn: e.target.value }))}
                rows={4}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Industry (AR)</Label>
              <Textarea
                value={about.industryAr}
                onChange={(e) => setAbout((prev) => ({ ...prev, industryAr: e.target.value }))}
                rows={4}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Customer Focus (EN)</Label>
              <Textarea
                value={about.customerEn}
                onChange={(e) => setAbout((prev) => ({ ...prev, customerEn: e.target.value }))}
                rows={4}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Customer Focus (AR)</Label>
              <Textarea
                value={about.customerAr}
                onChange={(e) => setAbout((prev) => ({ ...prev, customerAr: e.target.value }))}
                rows={4}
                className="rounded-none border-foreground/20 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-6 space-y-4">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">About Image</p>
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="border border-border/60 bg-background/50 aspect-21/9 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={about.imageUrl || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-3">
              <input
                ref={imageInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setMessage(null)
                  try {
                    const src = await uploadImage(file)
                    setAbout((prev) => ({ ...prev, imageUrl: src }))
                    setMessage("Image uploaded.")
                  } catch {
                    setMessage("Image upload failed.")
                  } finally {
                    e.target.value = ""
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-none h-10 w-full"
                onClick={() => imageInput.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload image
              </Button>

              <div className="space-y-2">
                <Label className="text-xs tracking-[0.15em] uppercase">Image path</Label>
                <div className="flex gap-2">
                  <Input value={about.imageUrl} readOnly className="rounded-none h-11 border-foreground/20" />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none h-11 px-3"
                    onClick={() => navigator.clipboard.writeText(about.imageUrl)}
                    title="Copy"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">Stats</h2>
            <p className="text-muted-foreground text-sm mt-1">Numbers displayed on the About page.</p>
          </div>
          <Button variant="outline" className="rounded-none h-10" onClick={addStat}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {stats.length === 0 ? (
          <div className="border border-border/60 p-8 text-muted-foreground">No stats yet.</div>
        ) : (
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <details key={index} className="group border border-border/60 bg-background/50">
                <summary className="cursor-pointer list-none p-6 flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                      {stat.value}
                      {stat.suffix || ""}
                    </p>
                    <h3 className="font-serif text-xl mt-2">{stat.labelEn || "Untitled"}</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none h-10"
                    onClick={(e) => {
                      e.preventDefault()
                      setStats((prev) => prev.filter((_, i) => i !== index))
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </summary>

                <div className="px-6 pb-8 grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Value</Label>
                    <Input
                      type="number"
                      value={Number.isFinite(stat.value) ? String(stat.value) : "0"}
                      onChange={(e) =>
                        setStats((prev) =>
                          prev.map((s, i) => (i === index ? { ...s, value: Number(e.target.value || 0) } : s)),
                        )
                      }
                      className="rounded-none h-11 border-foreground/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Suffix (optional)</Label>
                    <Input
                      value={stat.suffix ?? ""}
                      onChange={(e) =>
                        setStats((prev) => prev.map((s, i) => (i === index ? { ...s, suffix: e.target.value } : s)))
                      }
                      className="rounded-none h-11 border-foreground/20"
                      placeholder="+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Label (EN)</Label>
                    <Input
                      value={stat.labelEn}
                      onChange={(e) =>
                        setStats((prev) => prev.map((s, i) => (i === index ? { ...s, labelEn: e.target.value } : s)))
                      }
                      className="rounded-none h-11 border-foreground/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Label (AR)</Label>
                    <Input
                      value={stat.labelAr}
                      onChange={(e) =>
                        setStats((prev) => prev.map((s, i) => (i === index ? { ...s, labelAr: e.target.value } : s)))
                      }
                      className="rounded-none h-11 border-foreground/20"
                    />
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Values */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">Values</h2>
            <p className="text-muted-foreground text-sm mt-1">Company values displayed on the About page.</p>
          </div>
          <Button variant="outline" className="rounded-none h-10" onClick={addValue}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {values.length === 0 ? (
          <div className="border border-border/60 p-8 text-muted-foreground">No values yet.</div>
        ) : (
          <div className="space-y-3">
            {values.map((value, index) => (
              <details key={index} className="group border border-border/60 bg-background/50">
                <summary className="cursor-pointer list-none p-6 flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">Value</p>
                    <h3 className="font-serif text-xl mt-2">{value.titleEn || "Untitled"}</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none h-10"
                    onClick={(e) => {
                      e.preventDefault()
                      setValues((prev) => prev.filter((_, i) => i !== index))
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </summary>

                <div className="px-6 pb-8 grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Title (EN)</Label>
                      <Input
                        value={value.titleEn}
                        onChange={(e) =>
                          setValues((prev) =>
                            prev.map((v, i) => (i === index ? { ...v, titleEn: e.target.value } : v)),
                          )
                        }
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Title (AR)</Label>
                      <Input
                        value={value.titleAr}
                        onChange={(e) =>
                          setValues((prev) =>
                            prev.map((v, i) => (i === index ? { ...v, titleAr: e.target.value } : v)),
                          )
                        }
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Description (EN)</Label>
                      <Textarea
                        value={value.descEn}
                        onChange={(e) =>
                          setValues((prev) =>
                            prev.map((v, i) => (i === index ? { ...v, descEn: e.target.value } : v)),
                          )
                        }
                        rows={6}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Description (AR)</Label>
                      <Textarea
                        value={value.descAr}
                        onChange={(e) =>
                          setValues((prev) =>
                            prev.map((v, i) => (i === index ? { ...v, descAr: e.target.value } : v)),
                          )
                        }
                        rows={6}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Core Values Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">Core Values Cards</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the image-based cards integrated into the About values section.
            </p>
          </div>
          <Button variant="outline" className="rounded-none h-10" onClick={addCoreValue}>
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>

        <div className="border border-border/60 p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Section Title (EN)</Label>
              <Input
                value={coreValues.titleEn}
                onChange={(e) => setCoreValues((prev) => ({ ...prev, titleEn: e.target.value }))}
                className="rounded-none h-11 border-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Section Title (AR)</Label>
              <Input
                value={coreValues.titleAr}
                onChange={(e) => setCoreValues((prev) => ({ ...prev, titleAr: e.target.value }))}
                className="rounded-none h-11 border-foreground/20"
              />
            </div>
          </div>

          {coreValues.items.length === 0 ? (
            <div className="border border-border/60 p-8 text-muted-foreground">
              No core value cards yet. Click <span className="font-medium">Add Card</span> to create the first one.
            </div>
          ) : (
            <div className="space-y-3">
              {coreValues.items.map((value, index) => (
                <details key={value.id} className="group border border-border/60 bg-background/50">
                  <summary className="cursor-pointer list-none p-6 flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                        Card {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-serif text-xl mt-2">{value.labelEn || "Untitled card"}</h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-none h-10"
                      onClick={(e) => {
                        e.preventDefault()
                        setCoreValues((prev) => ({
                          ...prev,
                          items: prev.items.filter((item) => item.id !== value.id),
                        }))
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </summary>

                  <div className="px-6 pb-8 space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs tracking-[0.15em] uppercase">Label (EN)</Label>
                            <Input
                              value={value.labelEn}
                              onChange={(e) =>
                                setCoreValues((prev) => ({
                                  ...prev,
                                  items: prev.items.map((item) =>
                                    item.id === value.id ? { ...item, labelEn: e.target.value } : item,
                                  ),
                                }))
                              }
                              className="rounded-none h-11 border-foreground/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs tracking-[0.15em] uppercase">Label (AR)</Label>
                            <Input
                              value={value.labelAr}
                              onChange={(e) =>
                                setCoreValues((prev) => ({
                                  ...prev,
                                  items: prev.items.map((item) =>
                                    item.id === value.id ? { ...item, labelAr: e.target.value } : item,
                                  ),
                                }))
                              }
                              className="rounded-none h-11 border-foreground/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs tracking-[0.15em] uppercase">Headline (EN)</Label>
                          <Textarea
                            value={value.statementEn}
                            onChange={(e) =>
                              setCoreValues((prev) => ({
                                ...prev,
                                items: prev.items.map((item) =>
                                  item.id === value.id ? { ...item, statementEn: e.target.value } : item,
                                ),
                              }))
                            }
                            rows={3}
                            className="rounded-none border-foreground/20 resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs tracking-[0.15em] uppercase">Headline (AR)</Label>
                          <Textarea
                            value={value.statementAr}
                            onChange={(e) =>
                              setCoreValues((prev) => ({
                                ...prev,
                                items: prev.items.map((item) =>
                                  item.id === value.id ? { ...item, statementAr: e.target.value } : item,
                                ),
                              }))
                            }
                            rows={3}
                            className="rounded-none border-foreground/20 resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs tracking-[0.15em] uppercase">Intro (EN)</Label>
                          <Textarea
                            value={value.introEn}
                            onChange={(e) =>
                              setCoreValues((prev) => ({
                                ...prev,
                                items: prev.items.map((item) =>
                                  item.id === value.id ? { ...item, introEn: e.target.value } : item,
                                ),
                              }))
                            }
                            rows={4}
                            className="rounded-none border-foreground/20 resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs tracking-[0.15em] uppercase">Intro (AR)</Label>
                          <Textarea
                            value={value.introAr}
                            onChange={(e) =>
                              setCoreValues((prev) => ({
                                ...prev,
                                items: prev.items.map((item) =>
                                  item.id === value.id ? { ...item, introAr: e.target.value } : item,
                                ),
                              }))
                            }
                            rows={4}
                            className="rounded-none border-foreground/20 resize-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Image</p>
                        <div className="border border-border/60 bg-background/50 aspect-square max-w-xs overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={value.imageUrl || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                        </div>

                        <input
                          ref={(el) => {
                            coreValueImageInputs.current[value.id] = el
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            setMessage(null)
                            try {
                              const src = await uploadImage(file)
                              setCoreValues((prev) => ({
                                ...prev,
                                items: prev.items.map((item) => (item.id === value.id ? { ...item, imageUrl: src } : item)),
                              }))
                              setMessage("Image uploaded.")
                            } catch {
                              setMessage("Image upload failed.")
                            } finally {
                              e.target.value = ""
                            }
                          }}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-none h-10 w-full max-w-xs"
                          onClick={() => coreValueImageInputs.current[value.id]?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload image
                        </Button>

                        <div className="space-y-2">
                          <Label className="text-xs tracking-[0.15em] uppercase">Image path</Label>
                          <div className="flex gap-2">
                            <Input value={value.imageUrl} readOnly className="rounded-none h-11 border-foreground/20" />
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-none h-11 px-3"
                              onClick={() => navigator.clipboard.writeText(value.imageUrl)}
                              title="Copy"
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs tracking-[0.15em] uppercase">Points (EN)</Label>
                          <Textarea
                            value={itemsToLines(value.pointsEn)}
                            onChange={(e) =>
                              setCoreValues((prev) => ({
                                ...prev,
                                items: prev.items.map((item) =>
                                  item.id === value.id ? { ...item, pointsEn: linesToItems(e.target.value) } : item,
                                ),
                              }))
                            }
                            rows={7}
                            className="rounded-none border-foreground/20 resize-none"
                            placeholder="One item per line"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs tracking-[0.15em] uppercase">Points (AR)</Label>
                          <Textarea
                            value={itemsToLines(value.pointsAr)}
                            onChange={(e) =>
                              setCoreValues((prev) => ({
                                ...prev,
                                items: prev.items.map((item) =>
                                  item.id === value.id ? { ...item, pointsAr: linesToItems(e.target.value) } : item,
                                ),
                              }))
                            }
                            rows={7}
                            className="rounded-none border-foreground/20 resize-none"
                            placeholder="One item per line"
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
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">Milestones</h2>
            <p className="text-muted-foreground text-sm mt-1">Timeline items displayed on the About page.</p>
          </div>
          <Button variant="outline" className="rounded-none h-10" onClick={addMilestone}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {milestones.length === 0 ? (
          <div className="border border-border/60 p-8 text-muted-foreground">No milestones yet.</div>
        ) : (
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <details key={index} className="group border border-border/60 bg-background/50">
                <summary className="cursor-pointer list-none p-6 flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">{milestone.year}</p>
                    <h3 className="font-serif text-xl mt-2">{milestone.titleEn || "Untitled"}</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none h-10"
                    onClick={(e) => {
                      e.preventDefault()
                      setMilestones((prev) => prev.filter((_, i) => i !== index))
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </summary>

                <div className="px-6 pb-8 grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Year</Label>
                    <Input
                      value={milestone.year}
                      onChange={(e) =>
                        setMilestones((prev) =>
                          prev.map((m, i) => (i === index ? { ...m, year: e.target.value } : m)),
                        )
                      }
                      className="rounded-none h-11 border-foreground/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Title (EN)</Label>
                    <Input
                      value={milestone.titleEn}
                      onChange={(e) =>
                        setMilestones((prev) =>
                          prev.map((m, i) => (i === index ? { ...m, titleEn: e.target.value } : m)),
                        )
                      }
                      className="rounded-none h-11 border-foreground/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Title (AR)</Label>
                    <Input
                      value={milestone.titleAr}
                      onChange={(e) =>
                        setMilestones((prev) =>
                          prev.map((m, i) => (i === index ? { ...m, titleAr: e.target.value } : m)),
                        )
                      }
                      className="rounded-none h-11 border-foreground/20"
                    />
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
