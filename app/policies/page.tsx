import PoliciesClient from "./PoliciesClient"
import { readSiteContent } from "@/lib/site-content/store"
import { unstable_noStore as noStore } from "next/cache"

export default async function PoliciesPage() {
  noStore()
  const siteContent = await readSiteContent()
  return <PoliciesClient policies={siteContent.policies} />
}

