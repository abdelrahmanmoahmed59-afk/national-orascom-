import "server-only"

import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { newsletterSubscriptionSchema, type NewsletterSubscription } from "./schema"

const SUBSCRIPTIONS_PATH = path.join(process.cwd(), "data", "newsletter-subscriptions.json")

const subscriptionsSchema = z.array(newsletterSubscriptionSchema)

async function ensureFileExists() {
  await fs.mkdir(path.dirname(SUBSCRIPTIONS_PATH), { recursive: true })
  try {
    await fs.access(SUBSCRIPTIONS_PATH)
  } catch {
    await fs.writeFile(SUBSCRIPTIONS_PATH, JSON.stringify([], null, 2), "utf8")
  }
}

async function writeSubscriptions(next: NewsletterSubscription[]) {
  const parsed = subscriptionsSchema.parse(next)
  await fs.mkdir(path.dirname(SUBSCRIPTIONS_PATH), { recursive: true })

  const tmpPath = `${SUBSCRIPTIONS_PATH}.tmp`
  await fs.writeFile(tmpPath, JSON.stringify(parsed, null, 2), "utf8")
  await fs.rm(SUBSCRIPTIONS_PATH, { force: true })
  await fs.rename(tmpPath, SUBSCRIPTIONS_PATH)
}

export async function readNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
  await ensureFileExists()
  const raw = await fs.readFile(SUBSCRIPTIONS_PATH, "utf8")
  const json = JSON.parse(raw) as unknown
  return subscriptionsSchema.parse(json)
}

export async function appendNewsletterSubscription(subscription: NewsletterSubscription) {
  const parsed = newsletterSubscriptionSchema.parse(subscription)
  const current = await readNewsletterSubscriptions()
  await writeSubscriptions([...current, parsed])
}

export async function deleteNewsletterSubscription(id: string) {
  const current = await readNewsletterSubscriptions()
  const next = current.filter((s) => s.id !== id)
  await writeSubscriptions(next)
}

export async function clearNewsletterSubscriptions() {
  await writeSubscriptions([])
}

export function getNewsletterSubscriptionsPath() {
  return SUBSCRIPTIONS_PATH
}

