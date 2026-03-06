import { readSiteContent } from "@/lib/site-content/store"
import ContactEditor from "./contact-editor"

export default async function AdminContactPage() {
  const content = await readSiteContent()
  return <ContactEditor initialContact={content.contact} />
}

