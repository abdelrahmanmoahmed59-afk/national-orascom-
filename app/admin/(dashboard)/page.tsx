import Link from "next/link"

export default function AdminHomePage() {
  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10">
      <h1 className="font-serif text-3xl">Dashboard</h1>
      <p className="text-muted-foreground mt-2">Manage website content and form submissions stored in JSON files.</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <Link href="/admin/about" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">About</p>
          <p className="text-sm text-muted-foreground mt-1">Edit about page content, stats, and milestones.</p>
        </Link>
        <Link href="/admin/services" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">Services</p>
          <p className="text-sm text-muted-foreground mt-1">Add, edit, and upload service items.</p>
        </Link>
        <Link href="/admin/clients" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">Clients</p>
          <p className="text-sm text-muted-foreground mt-1">Add, edit, and upload client logos.</p>
        </Link>
        <Link href="/admin/projects" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">Projects</p>
          <p className="text-sm text-muted-foreground mt-1">Edit projects, gallery images, and details pages.</p>
        </Link>
        <Link href="/admin/table-projects" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">Table Projects</p>
          <p className="text-sm text-muted-foreground mt-1">Manage the Projects page table columns and JSON output.</p>
        </Link>
        <Link href="/admin/careers" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">Careers</p>
          <p className="text-sm text-muted-foreground mt-1">Manage job openings and apply email.</p>
        </Link>
        <Link href="/admin/contact" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">Contact & Footer</p>
          <p className="text-sm text-muted-foreground mt-1">Update address, phone, email, and social links.</p>
        </Link>
        <Link href="/admin/policies" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">Policies</p>
          <p className="text-sm text-muted-foreground mt-1">Edit the policies page content.</p>
        </Link>
        <Link href="/admin/applications" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">Applications</p>
          <p className="text-sm text-muted-foreground mt-1">View careers job applications submissions.</p>
        </Link>
        <Link href="/admin/messages" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">Messages</p>
          <p className="text-sm text-muted-foreground mt-1">View contact form messages.</p>
        </Link>
        <Link href="/admin/subscriptions" className="border border-border/60 p-6 hover:bg-muted transition-colors">
          <p className="font-medium">Subscriptions</p>
          <p className="text-sm text-muted-foreground mt-1">View newsletter subscriptions.</p>
        </Link>
      </div>
    </div>
  )
}
