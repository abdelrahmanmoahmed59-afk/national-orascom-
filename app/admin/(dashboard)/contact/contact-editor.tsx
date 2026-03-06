"use client"

import { useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type LocalizedString = { en: string; ar: string }

type SocialType = "linkedin" | "instagram" | "facebook" | "x" | "youtube" | "tiktok"

type SocialLink = {
  id: string
  type: SocialType
  url: string
}

type ContactContent = {
  address: LocalizedString
  phone: string
  email: string
  hours: LocalizedString
  socials: SocialLink[]
}

export default function ContactEditor({ initialContact }: { initialContact: ContactContent }) {
  const [contact, setContact] = useState<ContactContent>(initialContact)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function updateLocalized(field: "address" | "hours", lang: "en" | "ar", value: string) {
    setContact((prev) => ({ ...prev, [field]: { ...prev[field], [lang]: value } }))
  }

  function addSocial() {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `social-${Date.now()}`
    setContact((prev) => ({
      ...prev,
      socials: [...(prev.socials || []), { id, type: "linkedin", url: "" }],
    }))
  }

  function updateSocial(id: string, patch: Partial<SocialLink>) {
    setContact((prev) => ({
      ...prev,
      socials: (prev.socials || []).map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }

  function removeSocial(id: string) {
    setContact((prev) => ({ ...prev, socials: (prev.socials || []).filter((s) => s.id !== id) }))
  }

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const currentRes = await fetch("/api/admin/site-content", { cache: "no-store" })
      if (!currentRes.ok) throw new Error("Failed to load current content")
      const current = (await currentRes.json()) as any
      current.contact = contact

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
          <h1 className="font-serif text-3xl">Contact & Footer</h1>
          <p className="text-muted-foreground mt-2">Update address, phone, email, working hours, and social links.</p>
        </div>
        <Button className="rounded-none h-10" onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="border border-border/60 p-6 space-y-6">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Contact info</p>

          <div className="space-y-3">
            <Label className="text-xs tracking-[0.15em] uppercase">Address (EN)</Label>
            <Textarea
              value={contact.address.en}
              onChange={(e) => updateLocalized("address", "en", e.target.value)}
              className="rounded-none border-foreground/20 resize-none"
              rows={3}
            />
            <Label className="text-xs tracking-[0.15em] uppercase">Address (AR)</Label>
            <Textarea
              value={contact.address.ar}
              onChange={(e) => updateLocalized("address", "ar", e.target.value)}
              className="rounded-none border-foreground/20 resize-none"
              rows={3}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Phone</Label>
              <Input
                value={contact.phone}
                onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
                className="rounded-none h-11 border-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase">Email</Label>
              <Input
                value={contact.email}
                onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
                className="rounded-none h-11 border-foreground/20"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs tracking-[0.15em] uppercase">Working hours (EN)</Label>
            <Input
              value={contact.hours.en}
              onChange={(e) => updateLocalized("hours", "en", e.target.value)}
              className="rounded-none h-11 border-foreground/20"
            />
            <Label className="text-xs tracking-[0.15em] uppercase">Working hours (AR)</Label>
            <Input
              value={contact.hours.ar}
              onChange={(e) => updateLocalized("hours", "ar", e.target.value)}
              className="rounded-none h-11 border-foreground/20"
            />
          </div>
        </div>

        <div className="border border-border/60 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Social links</p>
            <Button variant="outline" className="rounded-none h-10" onClick={addSocial}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {(contact.socials || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No social links yet.</p>
          ) : (
            <div className="space-y-4">
              {contact.socials.map((social) => (
                <div key={social.id} className="border border-border/60 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">Link</p>
                    <Button
                      variant="outline"
                      className="rounded-none h-9"
                      onClick={() => removeSocial(social.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="space-y-2 sm:col-span-1">
                      <Label className="text-xs tracking-[0.15em] uppercase">Type</Label>
                      <select
                        className="h-11 w-full border border-foreground/20 bg-transparent px-3"
                        value={social.type}
                        onChange={(e) => updateSocial(social.id, { type: e.target.value as SocialType })}
                      >
                        <option value="linkedin">LinkedIn</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="x">X</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                      </select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs tracking-[0.15em] uppercase">URL</Label>
                      <Input
                        value={social.url}
                        onChange={(e) => updateSocial(social.id, { url: e.target.value })}
                        className="rounded-none h-11 border-foreground/20"
                        placeholder="https://…"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

