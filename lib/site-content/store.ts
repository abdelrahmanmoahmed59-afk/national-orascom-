import "server-only"

import { promises as fs } from "fs"
import path from "path"
import { DEFAULT_SITE_CONTENT } from "./default"
import { siteContentSchema, type SiteContent } from "./schema"

const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json")

async function ensureContentFileExists() {
  await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true })
  try {
    await fs.access(CONTENT_PATH)
  } catch {
    const seed = JSON.stringify(DEFAULT_SITE_CONTENT, null, 2)
    await fs.writeFile(CONTENT_PATH, seed, "utf8")
  }
}

export async function readSiteContent(): Promise<SiteContent> {
  await ensureContentFileExists()
  const raw = await fs.readFile(CONTENT_PATH, "utf8")
  const json = JSON.parse(raw) as unknown
  return siteContentSchema.parse(json)
}

export async function writeSiteContent(next: unknown): Promise<SiteContent> {
  const parsed = siteContentSchema.parse(next)
  await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true })

  const tmpPath = `${CONTENT_PATH}.tmp`
  await fs.writeFile(tmpPath, JSON.stringify(parsed, null, 2), "utf8")
  await fs.rm(CONTENT_PATH, { force: true })
  await fs.rename(tmpPath, CONTENT_PATH)
  return parsed
}

export function getSiteContentPath() {
  return CONTENT_PATH
}

