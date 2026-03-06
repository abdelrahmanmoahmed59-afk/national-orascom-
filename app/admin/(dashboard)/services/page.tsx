import { readSiteContent } from "@/lib/site-content/store"
import ServicesEditor from "./services-editor"

export default async function AdminServicesPage() {
  const content = await readSiteContent()
  return <ServicesEditor initialServices={content.services} />
}

