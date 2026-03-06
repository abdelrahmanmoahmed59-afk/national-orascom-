import CareersClient from "./CareersClient"
import { readSiteContent } from "@/lib/site-content/store"
import { unstable_noStore as noStore } from "next/cache"

export default async function CareersPage() {
  noStore()
  const siteContent = await readSiteContent()
  return <CareersClient openings={siteContent.careers.jobs} applyEmail={siteContent.careers.applyEmail} />
}
