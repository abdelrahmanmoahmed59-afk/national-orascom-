import ServicesClient from "./ServicesClient"
import { readSiteContent } from "@/lib/site-content/store"
import { unstable_noStore as noStore } from "next/cache"

export default async function ServicesPage() {
  noStore()
  const siteContent = await readSiteContent()
  return <ServicesClient services={siteContent.services} />
}
