"use client"

import { useMemo, useRef, useState } from "react"
import { Plus, Save, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type LocalizedString = { en: string; ar: string }

type ClientItem = {
  id: string
  name: LocalizedString
  logoSrc: string
  websiteUrl?: string
}

type ClientsSection = {
  title: LocalizedString
  subtitle: LocalizedString
  description: LocalizedString
  highlights: { en: string[]; ar: string[] }
  items: ClientItem[]
}

export default function ClientsEditor({ initialClients }: { initialClients: ClientsSection }) {
  const [section, setSection] = useState<ClientsSection>(initialClients)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  const hasItems = section.items.length > 0

  const sortedItems = useMemo(() => section.items, [section.items])

  function updateLocalized(path: "title" | "subtitle" | "description", lang: "en" | "ar", value: string) {
    setSection((prev) => ({
      ...prev,
      [path]: {
        ...prev[path],
        [lang]: value,
      },
    }))
  }

  function updateHighlights(lang: "en" | "ar", value: string) {
    const lines = value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    setSection((prev) => ({
      ...prev,
      highlights: {
        ...prev.highlights,
        [lang]: lines,
      },
    }))
  }

  function updateClient(id: string, patch: Partial<ClientItem> | ((prev: ClientItem) => ClientItem)) {
    setSection((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id) return item
        return typeof patch === "function" ? patch(item) : { ...item, ...patch }
      }),
    }))
  }

  function addClient() {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `client-${Date.now()}`
    setSection((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id,
          name: { en: "New client", ar: "عميل جديد" },
          logoSrc: "/placeholder-logo.svg",
          websiteUrl: "",
        },
      ],
    }))
  }

  function deleteClient(id: string) {
    setSection((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }))
  }

  async function uploadLogo(clientId: string, file: File) {
    setMessage(null)
    const form = new FormData()
    form.set("folder", "clients")
    form.set("file", file)

    const res = await fetch("/api/admin/upload", { method: "POST", body: form })
    if (!res.ok) {
      throw new Error("Upload failed")
    }
    const json = (await res.json()) as { src: string }
    updateClient(clientId, { logoSrc: json.src })
  }

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const currentRes = await fetch("/api/admin/site-content", { cache: "no-store" })
      if (!currentRes.ok) throw new Error("Failed to load current content")
      const current = (await currentRes.json()) as any
      current.clients = section

      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      })
      if (!res.ok) throw new Error("Save failed")
      setMessage("Saved.")
    } catch (err) {
      setMessage("Could not save changes.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Clients</h1>
          <p className="text-muted-foreground mt-2">Upload logos and manage bilingual client content.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none h-10" onClick={addClient}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
          <Button className="rounded-none h-10" onClick={save} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="border border-border/60 p-6 space-y-5 lg:col-span-1">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Section</p>

          <div className="space-y-3">
            <Label className="text-xs tracking-[0.15em] uppercase">Title (EN)</Label>
            <Input
              value={section.title.en}
              onChange={(e) => updateLocalized("title", "en", e.target.value)}
              className="rounded-none h-11 border-foreground/20"
            />
            <Label className="text-xs tracking-[0.15em] uppercase">Title (AR)</Label>
            <Input
              value={section.title.ar}
              onChange={(e) => updateLocalized("title", "ar", e.target.value)}
              className="rounded-none h-11 border-foreground/20"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs tracking-[0.15em] uppercase">Subtitle (EN)</Label>
            <Input
              value={section.subtitle.en}
              onChange={(e) => updateLocalized("subtitle", "en", e.target.value)}
              className="rounded-none h-11 border-foreground/20"
            />
            <Label className="text-xs tracking-[0.15em] uppercase">Subtitle (AR)</Label>
            <Input
              value={section.subtitle.ar}
              onChange={(e) => updateLocalized("subtitle", "ar", e.target.value)}
              className="rounded-none h-11 border-foreground/20"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs tracking-[0.15em] uppercase">Description (EN)</Label>
            <Textarea
              value={section.description.en}
              onChange={(e) => updateLocalized("description", "en", e.target.value)}
              className="rounded-none border-foreground/20 resize-none"
              rows={4}
            />
            <Label className="text-xs tracking-[0.15em] uppercase">Description (AR)</Label>
            <Textarea
              value={section.description.ar}
              onChange={(e) => updateLocalized("description", "ar", e.target.value)}
              className="rounded-none border-foreground/20 resize-none"
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs tracking-[0.15em] uppercase">Highlights (EN) – one per line</Label>
            <Textarea
              value={(section.highlights?.en || []).join("\n")}
              onChange={(e) => updateHighlights("en", e.target.value)}
              className="rounded-none border-foreground/20 resize-none"
              rows={5}
            />
            <Label className="text-xs tracking-[0.15em] uppercase">Highlights (AR) – one per line</Label>
            <Textarea
              value={(section.highlights?.ar || []).join("\n")}
              onChange={(e) => updateHighlights("ar", e.target.value)}
              className="rounded-none border-foreground/20 resize-none"
              rows={5}
            />
          </div>

          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>

        <div className="space-y-4 lg:col-span-2">
          {!hasItems && (
            <div className="border border-border/60 p-8 text-muted-foreground">
              No clients yet. Click <span className="font-medium">Add</span> to create your first client.
            </div>
          )}

          {sortedItems.map((client) => (
            <div key={client.id} className="border border-border/60 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Client</p>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{client.id}</p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-none h-10"
                  onClick={() => deleteClient(client.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Name (EN)</Label>
                    <Input
                      value={client.name.en}
                      onChange={(e) =>
                        updateClient(client.id, (prev) => ({ ...prev, name: { ...prev.name, en: e.target.value } }))
                      }
                      className="rounded-none h-11 border-foreground/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Name (AR)</Label>
                    <Input
                      value={client.name.ar}
                      onChange={(e) =>
                        updateClient(client.id, (prev) => ({ ...prev, name: { ...prev.name, ar: e.target.value } }))
                      }
                      className="rounded-none h-11 border-foreground/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Website</Label>
                    <Input
                      value={client.websiteUrl ?? ""}
                      onChange={(e) => updateClient(client.id, { websiteUrl: e.target.value })}
                      className="rounded-none h-11 border-foreground/20"
                      placeholder="https://…"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="border border-border/60 bg-background/50 h-28 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={client.logoSrc} alt="" className="max-h-24 max-w-full object-contain" />
                  </div>

                  <input
                    ref={(el) => {
                      fileInputs.current[client.id] = el
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      try {
                        await uploadLogo(client.id, file)
                        setMessage("Logo uploaded.")
                      } catch {
                        setMessage("Logo upload failed.")
                      } finally {
                        e.target.value = ""
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    className="rounded-none h-10 w-full"
                    onClick={() => fileInputs.current[client.id]?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload logo
                  </Button>

                  <div className="space-y-2">
                    <Label className="text-xs tracking-[0.15em] uppercase">Logo path</Label>
                    <div className="flex gap-2">
                      <Input value={client.logoSrc} readOnly className="rounded-none h-11 border-foreground/20" />
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-none h-11 px-3"
                        onClick={() => navigator.clipboard.writeText(client.logoSrc)}
                        title="Copy"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
