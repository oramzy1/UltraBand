import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin-dashboard"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function checkAdminAuth() {
  const cookieStore = await cookies()
  return cookieStore.get("admin-session")?.value === "authenticated"
}

export default async function AdminPage() {
  const isAuthenticated = await checkAdminAuth()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  const supabase = await createClient()

  const { data: bookings } = await supabase.from("bookings").select("*").order("created_at", { ascending: false })

  const { data: events } = await supabase.from("events").select("*").order("event_date", { ascending: true })

  const { data: gallery } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage bookings, events, and gallery content</p>
        </div>

        <AdminDashboard initialBookings={bookings || []} initialEvents={events || []} initialGallery={gallery || []} />
      </div>
    </div>
  )
}
