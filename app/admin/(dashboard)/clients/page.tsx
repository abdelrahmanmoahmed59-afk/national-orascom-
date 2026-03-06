import { readSiteContent } from "@/lib/site-content/store"
import ClientsEditor from "./clients-editor"

export default async function AdminClientsPage() {
  const content = await readSiteContent()
  return <ClientsEditor initialClients={content.clients} />
}

