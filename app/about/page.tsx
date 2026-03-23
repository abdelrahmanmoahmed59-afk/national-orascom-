import AboutClient from "./AboutClient"
import { readSiteContent } from "@/lib/site-content/store"
import { unstable_noStore as noStore } from "next/cache"

export default async function AboutPage() {
  noStore()
  const siteContent = await readSiteContent()

  return (
    <AboutClient
      content={siteContent.about}
      stats={siteContent.aboutStats}
      values={siteContent.aboutValues}
      coreValues={siteContent.aboutCoreValues}
      milestones={siteContent.aboutMilestones}
    />
  )
}
