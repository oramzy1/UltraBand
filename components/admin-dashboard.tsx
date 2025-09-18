"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingManagement } from "@/components/booking-management"
import { EventManagement } from "@/components/event-management"
import { GalleryManagement } from "@/components/gallery-management"
import { AdminSettings } from "@/components/admin-settings"
import { Calendar, Users, ImageIcon, Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Booking, Event, GalleryItem } from "@/lib/types"

interface AdminDashboardProps {
  initialBookings: Booking[]
  initialEvents: Event[]
  initialGallery: GalleryItem[]
}

export function AdminDashboard({ initialBookings, initialEvents, initialGallery }: AdminDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery)
  const router = useRouter()

  // Calculate stats
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length
  const upcomingEvents = events.filter((event) => new Date(event.event_date) >= new Date()).length
  const totalGalleryItems = gallery.length

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Require your attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">All time requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Scheduled performances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGalleryItems}</div>
            <p className="text-xs text-muted-foreground">Photos and videos</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Bookings
            {pendingBookings > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {pendingBookings}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <BookingManagement bookings={bookings} onBookingsUpdate={setBookings} />
        </TabsContent>

        <TabsContent value="events">
          <EventManagement events={events} onEventsUpdate={setEvents} />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryManagement gallery={gallery} onGalleryUpdate={setGallery} />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
