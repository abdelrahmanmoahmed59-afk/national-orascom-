import { NextResponse } from "next/server"
import { z } from "zod"
import path from "path"
import { promises as fs } from "fs"
import crypto from "crypto"
import { isSameOrigin } from "@/lib/auth/origin"

const folderSchema = z.enum(["clients", "projects", "services", "about", "branding", "misc"])

function extensionFromMime(mime: string) {
  if (mime === "image/png") return "png"
  if (mime === "image/jpeg") return "jpg"
  if (mime === "image/webp") return "webp"
  if (mime === "image/gif") return "gif"
  if (mime === "image/svg+xml") return "svg"
  return null
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const folderValue = form.get("folder")
  const folderParsed = folderSchema.safeParse(folderValue)
  if (!folderParsed.success) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 })
  }

  const fileValue = form.get("file")
  if (!(fileValue instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  if (fileValue.size <= 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 })
  }

  const maxBytes = 10 * 1024 * 1024
  if (fileValue.size > maxBytes) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 })
  }

  const mime = fileValue.type || ""
  const extFromMime = extensionFromMime(mime)
  const originalName = fileValue.name || "upload"
  const originalExt = path.extname(originalName).replace(".", "").toLowerCase()
  const ext = extFromMime || (originalExt.match(/^[a-z0-9]+$/) ? originalExt : null)

  if (!ext) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
  }

  const allowedExt = new Set(["png", "jpg", "jpeg", "webp", "gif", "svg"])
  if (!allowedExt.has(ext)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
  }

  const folder = folderParsed.data
  const filename = `${crypto.randomUUID()}.${ext === "jpeg" ? "jpg" : ext}`

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder)
  await fs.mkdir(uploadsDir, { recursive: true })

  const buffer = Buffer.from(await fileValue.arrayBuffer())
  const diskPath = path.join(uploadsDir, filename)
  await fs.writeFile(diskPath, buffer)

  const src = `/uploads/${folder}/${filename}`
  const response = NextResponse.json({ src })
  response.headers.set("Cache-Control", "no-store")
  return response
}
