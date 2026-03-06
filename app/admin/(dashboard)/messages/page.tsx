import { readContactSubmissions } from "@/lib/contact-submissions/store"
import MessagesClient from "./messages-client"

export default async function AdminMessagesPage() {
  const messages = await readContactSubmissions()
  return <MessagesClient initialMessages={messages} />
}

