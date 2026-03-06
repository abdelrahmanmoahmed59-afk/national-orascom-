import { readSiteContent } from "@/lib/site-content/store"
import TableProjectsEditor from "./table-projects-editor"

export default async function AdminTableProjectsPage() {
  const content = await readSiteContent()
  return <TableProjectsEditor initialProjects={content.projects} />
}

