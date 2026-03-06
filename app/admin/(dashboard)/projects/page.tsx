import { readSiteContent } from "@/lib/site-content/store"
import ProjectsEditor from "./projects-editor"

export default async function AdminProjectsPage() {
  const content = await readSiteContent()
  return <ProjectsEditor initialProjects={content.projects} />
}

