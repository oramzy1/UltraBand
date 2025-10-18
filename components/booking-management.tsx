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
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  ChevronDown,
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
  const [proposedCost, setProposedCost] = useState("");
  const [costNotes, setCostNotes] = useState("");
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
    ? bookings.filter(b => !b.archived) // Exclude archived
    : bookings.filter(
        (booking) => booking.service_category === serviceFilter && !booking.archived
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
      const updateData: any = {
        status,
        notes: notes || null,
      };

      if (status === "counter_proposed" && propDate && propTime) {
        updateData.proposed_date = propDate;
        updateData.proposed_time = propTime;
      }

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      const result = await response.json();

      // Update local state
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...result.booking } : booking
      );
      onBookingsUpdate(updatedBookings);

      toast({
        title: "Booking Updated",
        description: `Booking status changed to ${status.replace(
          "_",
          " "
        )}. Client has been notified via email.`,
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

  const sendCostProposal = async (bookingId: string, cost: string, notes: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/propose-cost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          proposed_cost: parseFloat(cost),
          notes 
        }),
      });
  
      if (!response.ok) throw new Error('Failed to send proposal');
  
      const result = await response.json();
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...result.booking } : booking
      );
      onBookingsUpdate(updatedBookings);
  
      toast({
        title: "Cost Proposal Sent",
        description: "Client has been notified via email.",
      });
  
      setProposedCost("");
      setCostNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send cost proposal",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const acceptCounterOffer = async (bookingId: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/accept-counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Failed to accept counter offer');
  
      const result = await response.json();
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...result.booking } : booking
      );
      onBookingsUpdate(updatedBookings);
  
      toast({
        title: "Counter Offer Accepted",
        description: "Payment link sent to client.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept counter offer",
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
          <Popover modal={false}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-48 justify-between">
                {serviceFilter === "all" && "All Services"}
                {serviceFilter === "events" && "Live Performance"}
                {serviceFilter === "mixing" && "Audio Mixing"}
                {serviceFilter === "video_editing" && "Video Editing"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
              <div className="space-y-1 p-1">
                {[
                  { value: "all", label: "All Services" },
                  { value: "events", label: "Live Performance" },
                  { value: "mixing", label: "Audio Mixing" },
                  { value: "video_editing", label: "Video Editing" },
                ].map((option) => (
                  <button
                    key={option.value}
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                    onClick={() => setServiceFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Badge variant="outline">{filteredBookings.length} Total</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {[...filteredBookings]
          .sort((a, b) => {
            const order = [
              "pending",
              "counter_proposed",
              "accepted",
              "rejected",
            ];
            return order.indexOf(a.status) - order.indexOf(b.status);
          })
          .map((booking) => (
            <Card
              key={booking.id}
              className="hover:shadow-md transition-shadow"
            >
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
                    <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Manage Booking - {booking.client_name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Quick Actions */}
                       {booking.service_category !== "events" && (
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
                       )}
                        {/* Counter Proposal */}
                       {booking.service_category !== "events" && (
                        <>
                         <div className="space-y-4">
                          <h4 className="font-semibold">Counter Proposal</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="proposedDate">
                                Proposed Date
                              </Label>
                              <Input
                                id="proposedDate"
                                type="date"
                                value={proposedDate}
                                onChange={(e) =>
                                  setProposedDate(e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="proposedTime">
                                Proposed Time
                              </Label>
                              <Input
                                id="proposedTime"
                                type="time"
                                value={proposedTime}
                                onChange={(e) =>
                                  setProposedTime(e.target.value)
                                }
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
                        </>
                       )}
                        {booking.service_category === "events" && (
                          <div className="space-y-4 border-t pt-4">
                            <h4 className="font-semibold">Cost Proposal</h4>

                            {/* Show negotiation history */}
                            {booking.negotiation_history &&
                              booking.negotiation_history.length > 0 && (
                                <div className="space-y-2 max-h-40 overflow-y-auto bg-muted p-3 rounded-md">
                                  <p className="text-sm font-medium">
                                    Negotiation History:
                                  </p>
                                  {booking.negotiation_history.map(
                                    (entry, idx) => (
                                      <div
                                        key={idx}
                                        className="text-sm border-b pb-2 last:border-0"
                                      >
                                        <p className="text-muted-foreground">
                                          {format(
                                            new Date(entry.timestamp),
                                            "PPp"
                                          )}
                                        </p>
                                        <p>
                                          <strong>
                                            {entry.actor === "admin"
                                              ? "You"
                                              : "Client"}
                                            :
                                          </strong>{" "}
                                          {entry.action === "propose_cost" &&
                                            `Proposed $${entry.amount}`}
                                          {entry.action === "counter_offer" &&
                                            `Counter-offered $${entry.amount}`}
                                          {entry.action === "accept" &&
                                            "Accepted offer"}
                                          {entry.action === "cancel" &&
                                            "Cancelled booking"}
                                        </p>
                                        {entry.notes && (
                                          <p className="text-muted-foreground italic">
                                            {entry.notes}
                                          </p>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}

                            {/* Current status */}
                            {booking.proposed_cost && (
                              <div className="bg-blue-950 p-3 rounded-md">
                                <p className="text-sm">
                                  <strong>Your Last Proposal:</strong> $
                                  {booking.proposed_cost}
                                </p>
                                {booking.client_counter_offer && (
                                  <p className="text-sm text-orange-400">
                                    <strong>Client Counter-Offer:</strong> $
                                    {booking.client_counter_offer}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Admin cost proposal input */}
                            <div className="space-y-2">
                              <Label htmlFor="proposedCost">
                                Propose Cost ($)
                              </Label>
                              <Input
                                id="proposedCost"
                                type="number"
                                step="0.01"
                                value={proposedCost}
                                onChange={(e) =>
                                  setProposedCost(e.target.value)
                                }
                                placeholder="Enter proposed cost"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="costNotes">
                                Additional Notes (Optional)
                              </Label>
                              <Textarea
                                id="costNotes"
                                value={costNotes}
                                onChange={(e) => setCostNotes(e.target.value)}
                                placeholder="Explain the cost breakdown..."
                                rows={2}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  sendCostProposal(
                                    booking.id,
                                    proposedCost,
                                    costNotes
                                  )
                                }
                                disabled={isUpdating || !proposedCost}
                              >
                                Send Cost Proposal
                              </Button>

                              {booking.client_counter_offer && (
                                <Button
                                  variant="outline"
                                  onClick={() => acceptCounterOffer(booking.id)}
                                  disabled={isUpdating}
                                >
                                  Accept Client's $
                                  {booking.client_counter_offer}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
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
                        Proposed:{" "}
                        {format(new Date(booking.proposed_date), "PPP")} at{" "}
                        {booking.proposed_time}
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
