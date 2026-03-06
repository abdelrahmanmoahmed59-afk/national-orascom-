import { readSiteContent } from "@/lib/site-content/store"
import AboutEditor from "./about-editor"

export default async function AdminAboutPage() {
  const content = await readSiteContent()
  return (
    <AboutEditor
      initialAbout={content.about}
      initialStats={content.aboutStats}
      initialValues={content.aboutValues}
      initialMilestones={content.aboutMilestones}
    />
  )
}

