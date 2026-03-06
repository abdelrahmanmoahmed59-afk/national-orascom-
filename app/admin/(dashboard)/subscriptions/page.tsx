import { readNewsletterSubscriptions } from "@/lib/newsletter-subscriptions/store"
import SubscriptionsClient from "./subscriptions-client"

export default async function AdminSubscriptionsPage() {
  const subscriptions = await readNewsletterSubscriptions()
  return <SubscriptionsClient initialSubscriptions={subscriptions} />
}

