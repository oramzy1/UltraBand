"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingManagement } from "@/components/booking-management";
import { BandMemberManagement } from "@/components/band-member-management";
import { EventManagement } from "@/components/event-management";
import { GalleryManagement } from "@/components/gallery-management";
import { AdminSettings } from "@/components/admin-settings";
import { LocationManagement } from "@/components/location-management";
import { ServicesManagement } from "@/components/services-management";
import {
  Calendar,
  Users,
  ImageIcon,
  Bell,
  Settings,
  LogOut,
  DollarSign,
  History,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { YouTubeVideoSelection } from "./youtube-video-selection";
import { format } from "date-fns";

export function AdminDashboard({
  initialBookings,
  initialEvents,
  initialGallery,
  initialLocations,
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [events, setEvents] = useState(initialEvents);
  const [gallery, setGallery] = useState(initialGallery);
  const [locations, setLocations] = useState([]);
  const [bandMembers, setBandMembers] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingBand, setLoadingBand] = useState(true);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions", err);
      }finally{
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchBand = async () => {
      try {
        const res = await fetch("/api/admin/band-members");
        const data = await res.json();
        setBandMembers(data);
      } catch (err) {
        console.error("Error fetching band members", err);
      } finally {
        setLoadingBand(false);
      }
    };

    fetchBand();
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("/api/locations");
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Error fetching band members", err);
      } finally {
        setLoadingBand(false);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services", err);
      } finally {
        setLoadingBand(false);
      }
    };

    fetchServices();
  }, []);

  // Calculate stats
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;
  const upcomingEvents = events.filter(
    (event) => new Date(event.event_date) >= new Date()
  ).length;
  const totalGalleryItems = gallery.length;

  const eventBookings = bookings.filter((b) => b.service_category === "events");
  const mixingBookings = bookings.filter(
    (b) => b.service_category === "mixing"
  );
  const videoBookings = bookings.filter(
    (b) => b.service_category === "video_editing"
  );

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 bg-transparent cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Bookings
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Require your attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">All time requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled performances
            </p>
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
        <TabsList className="flex w-full overflow-x-auto sm:grid sm:grid-cols-6 ps-80 sm:ps-0 snap-x snap-mandatory scroll-smooth">
          <TabsTrigger
            value="bookings"
            className="flex items-center gap-2 whitespace-nowrap snap-start cursor-pointer"
          >
            <Users className="h-4 w-4" />
            Bookings
            {pendingBookings > 0 && (
              <Badge
                variant="destructive"
                className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {pendingBookings}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="events"
            className="flex items-center gap-2 whitespace-nowrap snap-start cursor-pointer"
          >
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>

          <TabsTrigger
            value="management"
            className="flex items-center gap-2 whitespace-nowrap snap-start cursor-pointer"
          >
            <Users className="h-4 w-4" />
            Management
          </TabsTrigger>

          <TabsTrigger
            value="transactions"
            className="flex items-center gap-2 whitespace-nowrap snap-start cursor-pointer"
          >
            <History className="h-4 w-4" />
            Transactions
          </TabsTrigger>

          <TabsTrigger
            value="gallery"
            className="flex items-center gap-2 whitespace-nowrap snap-start cursor-pointer"
          >
            <ImageIcon className="h-4 w-4" />
            Gallery
          </TabsTrigger>

          <TabsTrigger
            value="settings"
            className="flex items-center gap-2 whitespace-nowrap snap-start cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <BookingManagement
            bookings={bookings}
            onBookingsUpdate={setBookings}
          />
        </TabsContent>

        <TabsContent value="events">
          <EventManagement events={events} onEventsUpdate={setEvents} />
        </TabsContent>

        <TabsContent value="management">
          {loadingBand ? (
            <p className="text-center animate-bounce">Loading...</p>
          ) : (
            <div className="space-y-6">
              <BandMemberManagement
                bandMembers={bandMembers}
                onBandMembersUpdate={setBandMembers}
              />
              <LocationManagement
                locations={locations}
                onLocationsUpdate={setLocations}
              />
              <ServicesManagement
                services={services}
                onServicesUpdate={setServices}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              { loading ? (                
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
              ):(
                <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center border-b pb-4"
                  >
                    <div>
                      <p className="font-semibold">{transaction.client_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.client_email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.created_at), "PPP 'at' p")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {transaction.transaction_id?.slice(0, 12)}...
                      </p>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No transactions yet
                  </p>
                )}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <div className="space-y-8">
            {/* Existing Gallery Management */}
            <div>
              <GalleryManagement
                gallery={gallery}
                onGalleryUpdate={setGallery}
              />
            </div>

            {/* YouTube Video Selection */}
            <div className="border-t pt-8">
              <YouTubeVideoSelection />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
