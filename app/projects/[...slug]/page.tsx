import { notFound } from "next/navigation"
import ProjectClient from "../[slug]/ProjectClient"
import { readSiteContent } from "@/lib/site-content/store"
import { unstable_noStore as noStore } from "next/cache"

export const dynamic = "force-dynamic"

type Params = { slug: string[] }

export default async function ProjectCatchAllPage({ params }: { params: Params | Promise<Params> }) {
  noStore()
  const resolvedParams = await params
  const siteContent = await readSiteContent()
  const requested = (resolvedParams?.slug ?? []).join("/").trim()
  if (!requested) notFound()

  const project = siteContent.projects.find((p) => p.slug.trim() === requested)
  if (!project) notFound()

  return <ProjectClient project={project} />
}
