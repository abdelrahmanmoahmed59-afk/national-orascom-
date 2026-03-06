import HomeClient from "./HomeClient"
import { readSiteContent } from "@/lib/site-content/store"
import { unstable_noStore as noStore } from "next/cache"

export default async function HomePage() {
  noStore()
  const siteContent = await readSiteContent()
  return <HomeClient services={siteContent.services} projects={siteContent.projects} clients={siteContent.clients} contact={siteContent.contact} />
}

