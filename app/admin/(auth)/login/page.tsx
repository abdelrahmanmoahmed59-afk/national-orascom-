"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/i18n/language-context"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { dir, language } = useLanguage()

  const next = useMemo(() => searchParams.get("next") || "/admin", [searchParams])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const labels = {
    title: language === "en" ? "Admin Dashboard" : "لوحة التحكم",
    subtitle: language === "en" ? "Sign in to manage website content" : "سجّل الدخول لإدارة محتوى الموقع",
    username: language === "en" ? "Username" : "اسم المستخدم",
    password: language === "en" ? "Password" : "كلمة المرور",
    signIn: language === "en" ? "Sign in" : "تسجيل الدخول",
    signingIn: language === "en" ? "Signing in…" : "جارٍ تسجيل الدخول…",
    invalid: language === "en" ? "Invalid username or password" : "اسم المستخدم أو كلمة المرور غير صحيحة",
    notConfigured:
      language === "en"
        ? "Admin auth is not configured. Set AUTH_SECRET, ADMIN_USERNAME, and ADMIN_PASSWORD_HASH in .env.local then restart the server."
        : "لم يتم إعداد دخول لوحة التحكم. قم بتحديد AUTH_SECRET و ADMIN_USERNAME و ADMIN_PASSWORD_HASH في ملف .env.local ثم أعد تشغيل السيرفر.",
    misconfigured:
      language === "en"
        ? "Admin auth is misconfigured (ADMIN_PASSWORD_HASH). Re-generate it using `node scripts/hash-admin-password.mjs \"your-password\"`, paste the line it prints into .env.local, then restart the server."
        : "تم إعداد الدخول بشكل غير صحيح (ADMIN_PASSWORD_HASH). أعد إنشاء القيمة باستخدام `node scripts/hash-admin-password.mjs \"your-password\"` ثم انسخ السطر الناتج إلى ملف .env.local وأعد تشغيل السيرفر.",
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        if (res.status === 500 && data?.error === "Server auth is not configured") {
          setError(labels.notConfigured)
          return
        }
        if (res.status === 500 && data?.error === "Server auth is misconfigured") {
          setError(labels.misconfigured)
          return
        }
        setError(labels.invalid)
        return
      }
      router.push(next)
      router.refresh()
    } catch {
      setError(labels.invalid)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md border border-border/60 bg-background/60 backdrop-blur p-8">
        <h1 className="font-serif text-3xl">{labels.title}</h1>
        <p className="text-muted-foreground mt-2">{labels.subtitle}</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-xs tracking-[0.15em] uppercase">
              {labels.username}
            </Label>
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-none h-12 border-foreground/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs tracking-[0.15em] uppercase">
              {labels.password}
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none h-12 border-foreground/20"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" size="lg" className="rounded-none px-8 h-12 w-full" disabled={loading}>
            {loading ? labels.signingIn : labels.signIn}
          </Button>
        </form>
      </div>
    </div>
  )
}
