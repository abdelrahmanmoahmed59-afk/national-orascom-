import "server-only"

import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { jobApplicationSchema, type JobApplication } from "./schema"

const APPLICATIONS_PATH = path.join(process.cwd(), "data", "job-applications.json")

const applicationsSchema = z.array(jobApplicationSchema)

async function ensureFileExists() {
  await fs.mkdir(path.dirname(APPLICATIONS_PATH), { recursive: true })
  try {
    await fs.access(APPLICATIONS_PATH)
  } catch {
    await fs.writeFile(APPLICATIONS_PATH, JSON.stringify([], null, 2), "utf8")
  }
}

async function writeApplications(next: JobApplication[]) {
  const parsed = applicationsSchema.parse(next)
  await fs.mkdir(path.dirname(APPLICATIONS_PATH), { recursive: true })

  const tmpPath = `${APPLICATIONS_PATH}.tmp`
  await fs.writeFile(tmpPath, JSON.stringify(parsed, null, 2), "utf8")
  await fs.rm(APPLICATIONS_PATH, { force: true })
  await fs.rename(tmpPath, APPLICATIONS_PATH)
}

export async function readApplications(): Promise<JobApplication[]> {
  await ensureFileExists()
  const raw = await fs.readFile(APPLICATIONS_PATH, "utf8")
  const json = JSON.parse(raw) as unknown
  return applicationsSchema.parse(json)
}

export async function appendApplication(application: JobApplication) {
  const parsed = jobApplicationSchema.parse(application)
  const current = await readApplications()
  await writeApplications([...current, parsed])
}

export async function deleteApplication(id: string) {
  const current = await readApplications()
  const next = current.filter((a) => a.id !== id)
  await writeApplications(next)
}

export async function clearApplications() {
  await writeApplications([])
}

export function getApplicationsPath() {
  return APPLICATIONS_PATH
}
