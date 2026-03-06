import { readSiteContent } from "@/lib/site-content/store"
import CareersEditor from "./careers-editor"

export default async function AdminCareersPage() {
  const content = await readSiteContent()
  return <CareersEditor initialCareers={content.careers} />
}

