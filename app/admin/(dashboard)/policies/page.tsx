import { readSiteContent } from "@/lib/site-content/store"
import PoliciesEditor from "./policies-editor"

export default async function AdminPoliciesPage() {
  const content = await readSiteContent()
  return <PoliciesEditor initialPolicies={content.policies} />
}

