import { readApplications } from "@/lib/applications/store"
import ApplicationsClient from "./applications-client"

export default async function AdminApplicationsPage() {
  const applications = await readApplications()
  return <ApplicationsClient initialApplications={applications} />
}

