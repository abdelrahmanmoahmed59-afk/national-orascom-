import ProjectsClient from "./ProjectsClient"
import { readSiteContent } from "@/lib/site-content/store"
import { unstable_noStore as noStore } from "next/cache"

export default async function ProjectsPage() {
  noStore()
  const siteContent = await readSiteContent()
  return <ProjectsClient projects={siteContent.projects} />
}
