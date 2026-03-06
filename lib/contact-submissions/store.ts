import "server-only"

import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { contactSubmissionSchema, type ContactSubmission } from "./schema"

const SUBMISSIONS_PATH = path.join(process.cwd(), "data", "contact-submissions.json")

const submissionsSchema = z.array(contactSubmissionSchema)

async function ensureFileExists() {
  await fs.mkdir(path.dirname(SUBMISSIONS_PATH), { recursive: true })
  try {
    await fs.access(SUBMISSIONS_PATH)
  } catch {
    await fs.writeFile(SUBMISSIONS_PATH, JSON.stringify([], null, 2), "utf8")
  }
}

async function writeSubmissions(next: ContactSubmission[]) {
  const parsed = submissionsSchema.parse(next)
  await fs.mkdir(path.dirname(SUBMISSIONS_PATH), { recursive: true })

  const tmpPath = `${SUBMISSIONS_PATH}.tmp`
  await fs.writeFile(tmpPath, JSON.stringify(parsed, null, 2), "utf8")
  await fs.rm(SUBMISSIONS_PATH, { force: true })
  await fs.rename(tmpPath, SUBMISSIONS_PATH)
}

export async function readContactSubmissions(): Promise<ContactSubmission[]> {
  await ensureFileExists()
  const raw = await fs.readFile(SUBMISSIONS_PATH, "utf8")
  const json = JSON.parse(raw) as unknown
  return submissionsSchema.parse(json)
}

export async function appendContactSubmission(submission: ContactSubmission) {
  const parsed = contactSubmissionSchema.parse(submission)
  const current = await readContactSubmissions()
  await writeSubmissions([...current, parsed])
}

export async function deleteContactSubmission(id: string) {
  const current = await readContactSubmissions()
  const next = current.filter((s) => s.id !== id)
  await writeSubmissions(next)
}

export async function clearContactSubmissions() {
  await writeSubmissions([])
}

export function getContactSubmissionsPath() {
  return SUBMISSIONS_PATH
}

