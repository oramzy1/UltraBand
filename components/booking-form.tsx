"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingFormData {
  serviceCategory: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: Date | undefined;
  eventTime: string;
  eventLocation: string;
  eventDescription: string;
  budgetRange: string;
}

export function BookingForm() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    serviceCategory: "events",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventType: "",
    eventDate: undefined,
    eventTime: "",
    eventLocation: "",
    eventDescription: "",
    budgetRange: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("bookings").insert({
        service_category: formData.serviceCategory,
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        event_type: formData.eventType,
        event_date: formData.eventDate?.toISOString().split("T")[0],
        event_time: formData.eventTime,
        event_location: formData.eventLocation,
        event_description: formData.eventDescription,
        budget_range: formData.budgetRange,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Booking Request Submitted!",
        description:
          "We'll get back to you within 24 hours with a custom proposal.",
      });

      // Reset form
      setFormData({
        serviceCategory: "events",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        eventType: "",
        eventDate: undefined,
        eventTime: "",
        eventLocation: "",
        eventDescription: "",
        budgetRange: "",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description:
          "There was a problem submitting your booking request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Full Name *</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              required
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email Address *</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) =>
                setFormData({ ...formData, clientEmail: e.target.value })
              }
              required
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhone">Phone Number</Label>
          <Input
            id="clientPhone"
            type="tel"
            value={formData.clientPhone}
            onChange={(e) =>
              setFormData({ ...formData, clientPhone: e.target.value })
            }
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {/* Event Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Service Details</h3>

        <div className="space-y-2">
          <Label htmlFor="serviceCategory">Service Category *</Label>
          <Select
            value={formData.serviceCategory}
            onValueChange={(value) =>
              setFormData({ ...formData, serviceCategory: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="events">Live Event Performance</SelectItem>
              <SelectItem value="mixing">Audio Mixing Services</SelectItem>
              <SelectItem value="video_editing">
                Video Editing Services
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type *</Label>
            <Select
              value={formData.eventType}
              onValueChange={(value) =>
                setFormData({ ...formData, eventType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="corporate">Corporate Event</SelectItem>
                <SelectItem value="private-party">Private Party</SelectItem>
                <SelectItem value="birthday">Birthday Party</SelectItem>
                <SelectItem value="anniversary">Anniversary</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetRange">Budget Range</Label>
            <Select
              value={formData.budgetRange}
              onValueChange={(value) =>
                setFormData({ ...formData, budgetRange: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-2000">Under $2,000</SelectItem>
                <SelectItem value="2000-3500">$2,000 - $3,500</SelectItem>
                <SelectItem value="3500-5000">$3,500 - $5,000</SelectItem>
                <SelectItem value="5000-7000">$5,000 - $7,000</SelectItem>
                <SelectItem value="over-7000">Over $7,000</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Event Date *</Label>
            <div className="relative">
              <Button
                variant="outline"
                type="button"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.eventDate && "text-muted-foreground"
                )}
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.eventDate
                  ? format(formData.eventDate, "PPP")
                  : "Pick a date"}
              </Button>

              {showDatePicker && (
                <div className="absolute top-full left-0 mt-1 bg-black border border-gray-200 rounded-md shadow-lg z-50 p-4">
                  <Calendar
                    mode="single"
                    selected={formData.eventDate}
                    onSelect={(date) => {
                      setFormData({ ...formData, eventDate: date });
                      setShowDatePicker(false);
                    }}
                    disabled={(date) => date < new Date()}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventTime">Event Time *</Label>
            <Input
              id="eventTime"
              type="time"
              value={formData.eventTime}
              onChange={(e) =>
                setFormData({ ...formData, eventTime: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventLocation">Event Location *</Label>
          <Input
            id="eventLocation"
            value={formData.eventLocation}
            onChange={(e) =>
              setFormData({ ...formData, eventLocation: e.target.value })
            }
            required
            placeholder="Venue name and address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventDescription">Event Description</Label>
          <Textarea
            id="eventDescription"
            value={formData.eventDescription}
            onChange={(e) =>
              setFormData({ ...formData, eventDescription: e.target.value })
            }
            placeholder="Tell us more about your event, music preferences, special requests, etc."
            rows={4}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Request...
          </>
        ) : (
          "Submit Booking Request"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this form, you agree to be contacted by Ultra Band
        regarding your event booking.
      </p>
    </form>
  );
}
