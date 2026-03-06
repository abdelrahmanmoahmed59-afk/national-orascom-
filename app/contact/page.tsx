import ContactClient from "./ContactClient"
import { readSiteContent } from "@/lib/site-content/store"
import { unstable_noStore as noStore } from "next/cache"

export default async function ContactPage() {
  noStore()
  const siteContent = await readSiteContent()
  return <ContactClient contact={siteContent.contact} />
}

