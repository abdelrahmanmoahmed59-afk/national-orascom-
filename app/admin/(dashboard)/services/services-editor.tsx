"use client"

import { useRef, useState } from "react"
import { Plus, Save, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { SiteContent } from "@/lib/site-content/schema"

type ServiceItem = SiteContent["services"][number]

export default function ServicesEditor({ initialServices }: { initialServices: ServiceItem[] }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const imageInputs = useRef<Record<string, HTMLInputElement | null>>({})

  function updateService(id: string, patch: Partial<ServiceItem> | ((prev: ServiceItem) => ServiceItem)) {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id !== id) return service
        return typeof patch === "function" ? patch(service) : { ...service, ...patch }
      }),
    )
  }

  function addService() {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `service-${Date.now()}`
    const nextNum = (services.length + 1).toString().padStart(2, "0")
    setServices((prev) => [
      ...prev,
      {
        id,
        num: nextNum,
        titleEn: "New Service",
        titleAr: "خدمة جديدة",
        descEn: "",
        descAr: "",
        imageUrl: "/placeholder.jpg",
      },
    ])
  }

  function deleteService(id: string) {
    setServices((prev) => prev.filter((service) => service.id !== id))
  }

  async function uploadImage(file: File) {
    const form = new FormData()
    form.set("folder", "services")
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
      current.services = services

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
          <h1 className="font-serif text-3xl">Services</h1>
          <p className="text-muted-foreground mt-2">Add, edit, and upload bilingual services content.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none h-10" onClick={addService}>
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

      {services.length === 0 ? (
        <div className="border border-border/60 p-8 text-muted-foreground">
          No services yet. Click <span className="font-medium">Add</span> to create your first service.
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <details key={service.id} className="group border border-border/60 bg-background/50">
              <summary className="cursor-pointer list-none p-6 lg:p-8 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                    {service.num || "—"} • {service.id}
                  </p>
                  <h2 className="font-serif text-2xl mt-2">{service.titleEn || "Untitled"}</h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none h-10"
                  onClick={(e) => {
                    e.preventDefault()
                    deleteService(service.id)
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
                        <Label className="text-xs tracking-[0.15em] uppercase">Number</Label>
                        <Input
                          value={service.num ?? ""}
                          onChange={(e) => updateService(service.id, { num: e.target.value })}
                          className="rounded-none h-11 border-foreground/20"
                          placeholder="01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-[0.15em] uppercase">ID</Label>
                        <Input value={service.id} readOnly className="rounded-none h-11 border-foreground/20" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Title (EN)</Label>
                      <Input
                        value={service.titleEn}
                        onChange={(e) => updateService(service.id, { titleEn: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Title (AR)</Label>
                      <Input
                        value={service.titleAr}
                        onChange={(e) => updateService(service.id, { titleAr: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Description (EN)</Label>
                      <Textarea
                        value={service.descEn}
                        onChange={(e) => updateService(service.id, { descEn: e.target.value })}
                        rows={5}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Description (AR)</Label>
                      <Textarea
                        value={service.descAr}
                        onChange={(e) => updateService(service.id, { descAr: e.target.value })}
                        rows={5}
                        className="rounded-none border-foreground/20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Image</p>
                    <div className="border border-border/60 bg-background/50 aspect-4/3 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.imageUrl || "/placeholder.jpg"}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <input
                      ref={(el) => {
                        imageInputs.current[service.id] = el
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
                          updateService(service.id, { imageUrl: src })
                          setMessage("Image uploaded.")
                        } catch {
                          setMessage("Image upload failed.")
                        } finally {
                          e.target.value = ""
                        }
                      }}
                    />

                    <Button
                      variant="outline"
                      className="rounded-none h-10 w-full"
                      onClick={() => imageInputs.current[service.id]?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload image
                    </Button>

                    <div className="space-y-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">Image path</Label>
                      <div className="flex gap-2">
                        <Input value={service.imageUrl} readOnly className="rounded-none h-11 border-foreground/20" />
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-none h-11 px-3"
                          onClick={() => navigator.clipboard.writeText(service.imageUrl)}
                          title="Copy"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
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

