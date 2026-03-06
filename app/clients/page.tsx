import ClientsClient from "./ClientsClient"
import { readSiteContent } from "@/lib/site-content/store"
import { unstable_noStore as noStore } from "next/cache"

export default async function ClientsPage() {
  noStore()
  const siteContent = await readSiteContent()
  return <ClientsClient clients={siteContent.clients} />
}

