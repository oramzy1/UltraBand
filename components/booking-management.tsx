"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  MessageSquare,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Booking } from "@/lib/types";

interface BookingManagementProps {
  bookings: Booking[];
  onBookingsUpdate: (bookings: Booking[]) => void;
}

export function BookingManagement({
  bookings,
  onBookingsUpdate,
}: BookingManagementProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "accepted":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "counter_proposed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const filteredBookings =
    serviceFilter === "all"
      ? bookings
      : bookings.filter(
          (booking) => booking.service_category === serviceFilter
        );

  const updateBookingStatus = async (
    bookingId: string,
    status: string,
    notes?: string,
    propDate?: string,
    propTime?: string
  ) => {
    setIsUpdating(true);
    try {
      const supabase = createClient();

      const updateData: any = {
        status,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      };

      if (status === "counter_proposed" && propDate && propTime) {
        updateData.proposed_date = propDate;
        updateData.proposed_time = propTime;
      }

      const { data, error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...data } : booking
      );
      onBookingsUpdate(updatedBookings);

      toast({
        title: "Booking Updated",
        description: `Booking status changed to ${status.replace("_", " ")}`,
      });

      setSelectedBooking(null);
      setAdminNotes("");
      setProposedDate("");
      setProposedTime("");
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="block md:flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Requests</h2>
        <div className="flex items-center gap-4">
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="events">Live Performance</SelectItem>
              <SelectItem value="mixing">Audio Mixing</SelectItem>
              <SelectItem value="video_editing">Video Editing</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline">{filteredBookings.length} Total</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {booking.client_name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {booking.service_category === "events"
                      ? booking.event_type
                      : booking.service_category === "mixing"
                      ? "Audio Mixing & Mastering"
                      : "Video Editing"}
                  </p>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{format(new Date(booking.event_date), "PPP")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{booking.event_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{booking.event_location}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{booking.client_email}</span>
                  </div>
                  {booking.client_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{booking.client_phone}</span>
                    </div>
                  )}
                  {booking.budget_range && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span>{booking.budget_range}</span>
                    </div>
                  )}
                </div>
              </div>

              {booking.event_description && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {booking.event_description}
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setAdminNotes(booking.notes || "");
                      }}
                    >
                      Manage
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        Manage Booking - {booking.client_name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Quick Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "accepted",
                              adminNotes
                            )
                          }
                          disabled={isUpdating}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "rejected",
                              adminNotes
                            )
                          }
                          disabled={isUpdating}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "pending",
                              adminNotes
                            )
                          }
                          disabled={isUpdating}
                        >
                          Mark Pending
                        </Button>
                      </div>

                      {/* Counter Proposal */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Counter Proposal</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="proposedDate">Proposed Date</Label>
                            <Input
                              id="proposedDate"
                              type="date"
                              value={proposedDate}
                              onChange={(e) => setProposedDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="proposedTime">Proposed Time</Label>
                            <Input
                              id="proposedTime"
                              type="time"
                              value={proposedTime}
                              onChange={(e) => setProposedTime(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "counter_proposed",
                              adminNotes,
                              proposedDate,
                              proposedTime
                            )
                          }
                          disabled={
                            isUpdating || !proposedDate || !proposedTime
                          }
                        >
                          Send Counter Proposal
                        </Button>
                      </div>

                      {/* Admin Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="adminNotes">Admin Notes</Label>
                        <Textarea
                          id="adminNotes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add internal notes about this booking..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {booking.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() =>
                        updateBookingStatus(booking.id, "accepted")
                      }
                      disabled={isUpdating}
                    >
                      Quick Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        updateBookingStatus(booking.id, "rejected")
                      }
                      disabled={isUpdating}
                    >
                      Quick Reject
                    </Button>
                  </>
                )}
              </div>

              {booking.notes && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Admin Notes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.notes}
                  </p>
                </div>
              )}

              {booking.status === "counter_proposed" &&
                booking.proposed_date &&
                booking.proposed_time && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                    <p className="text-sm font-medium text-blue-600 mb-1">
                      Counter Proposal Sent
                    </p>
                    <p className="text-sm text-blue-600">
                      Proposed: {format(new Date(booking.proposed_date), "PPP")}{" "}
                      at {booking.proposed_time}
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        ))}

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                No Booking Requests
              </h3>
              <p className="text-muted-foreground">
                {serviceFilter === "all"
                  ? "New booking requests will appear here."
                  : `No ${
                      serviceFilter === "events"
                        ? "live performance"
                        : serviceFilter
                    } requests found.`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
