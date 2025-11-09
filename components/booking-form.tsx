"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Check, ChevronDown, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TimePicker } from "./ui/time-picker";

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

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY;

export function BookingForm() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const turnstileTokenRef = useRef<string | null>(null);
  const turnstileWidgetIdRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Load the Turnstile script
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (
      document.querySelector(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      )
    ) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = () => {
      setScriptLoaded(false);
      console.error("Turnstile script failed to load");
    };

    document.body.appendChild(script);

    (window as any).onTurnstileSuccess = (token: string) => {
      turnstileTokenRef.current = token;
    };

    return () => {
      try {
        delete (window as any).onTurnstileSuccess;
      } catch (e) {}
    };
  }, []);

  const resetTurnstile = () => {
    if (
      typeof window !== "undefined" &&
      (window as any).turnstile &&
      turnstileWidgetIdRef.current !== null
    ) {
      try {
        (window as any).turnstile.reset(turnstileWidgetIdRef.current);
        turnstileTokenRef.current = null;
      } catch (err) {
        console.error("Turnstile reset error:", err);
      }
    } else {
      turnstileTokenRef.current = null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;

    const honeyValue = (form.elements.namedItem("website") as HTMLInputElement)
      ?.value;

    if (honeyValue) {
      console.warn("Bot detected — submission blocked");
      setIsSubmitting(false);
      return;
    }

    if (!scriptLoaded) {
      toast({
        title: "Error",
        description: "CAPTCHA failed to load. Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const turnstileToken = turnstileTokenRef.current;

    if (!turnstileToken) {
      toast({
        title: "Error",
        description: "Please complete the CAPTCHA verification.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceCategory: formData.serviceCategory,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone,
          eventType: formData.eventType,
          eventDate: formData.eventDate?.toISOString().split("T")[0],
          eventTime: formData.eventTime,
          eventLocation: formData.eventLocation,
          eventDescription: formData.eventDescription,
          budgetRange: formData.budgetRange,
          turnstileToken,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit booking");

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
      resetTurnstile();
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
        <h3 className="sm:text-lg font-semibold border-b border-gray-500">
          Contact Information
        </h3>

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
        <h3 className="text-lg font-semibold border-b border-gray-500">
          Service Details
        </h3>

        <div className="space-y-2">
          <Label htmlFor="serviceCategory">Service Category *</Label>
          <Popover modal={false}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {formData.serviceCategory === "events" &&
                  "Live Event Performance"}
                {formData.serviceCategory === "mixing" &&
                  "Audio Mixing & Mastering"}
                {formData.serviceCategory === "video_editing" &&
                  "Video Editing Services"}
                {!formData.serviceCategory && "Select service type"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="space-y-1 p-1">
                {[
                  { value: "events", label: "Live Event Performance" },
                  { value: "mixing", label: "Audio Mixing Services" },
                  { value: "video_editing", label: "Video Editing Services" },
                ].map((option) => (
                  <button
                    key={option.value}
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm flex items-center"
                    onClick={() => {
                      const newCategory = option.value;
                      setFormData({
                        ...formData,
                        serviceCategory: newCategory,
                        eventType:
                          newCategory === "events" ? formData.eventType : "",
                      });
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        formData.serviceCategory === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div
          className={`grid gap-4 ${
            formData.serviceCategory === "events"
              ? "md:grid-cols-1"
              : "md:grid-cols-1"
          }`}
        >
          {formData.serviceCategory === "events" && (
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type *</Label>
              <Popover modal={false}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {formData.eventType === "wedding" && "Wedding"}
                    {formData.eventType === "corporate" && "Corporate Event"}
                    {formData.eventType === "private-party" && "Private Party"}
                    {formData.eventType === "birthday" && "Birthday Party"}
                    {formData.eventType === "anniversary" && "Anniversary"}
                    {formData.eventType === "festival" && "Festival"}
                    {formData.eventType === "other" && "Other"}
                    {!formData.eventType && "Select event type"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="space-y-1 p-1">
                    {[
                      { value: "wedding", label: "Wedding" },
                      { value: "corporate", label: "Corporate Event" },
                      { value: "private-party", label: "Private Party" },
                      { value: "birthday", label: "Birthday Party" },
                      { value: "anniversary", label: "Anniversary" },
                      { value: "festival", label: "Festival" },
                      { value: "other", label: "Other" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm flex items-center"
                        onClick={() =>
                          setFormData({ ...formData, eventType: option.value })
                        }
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            formData.eventType === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* {formData.serviceCategory === "events" ? (
            <></>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="budgetRange">Budget Range</Label>
              <Popover modal={false}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {formData.budgetRange === "under-2000" && "Under $2,000"}
                    {formData.budgetRange === "2000-3500" && "$2,000 - $3,500"}
                    {formData.budgetRange === "3500-5000" && "$3,500 - $5,000"}
                    {formData.budgetRange === "5000-7000" && "$5,000 - $7,000"}
                    {formData.budgetRange === "over-7000" && "Over $7,000"}
                    {formData.budgetRange === "flexible" && "Flexible"}
                    {!formData.budgetRange && "Select budget range"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="space-y-1 p-1">
                    {[
                      { value: "under-2000", label: "Under $2,000" },
                      { value: "2000-3500", label: "$2,000 - $3,500" },
                      { value: "3500-5000", label: "$3,500 - $5,000" },
                      { value: "5000-7000", label: "$5,000 - $7,000" },
                      { value: "over-7000", label: "Over $7,000" },
                      { value: "flexible", label: "Flexible" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm flex items-center"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            budgetRange: option.value,
                          })
                        }
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            formData.budgetRange === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )} */}
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
          {/* <div className="space-y-2">
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
          </div> */}
          <div className="space-y-2">
            <Label>Event Time *</Label>
            <div className="relative">
              <Button
                variant="outline"
                type="button"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.eventTime && "text-muted-foreground"
                )}
                onClick={() => setShowTimePicker(!showTimePicker)}
              >
                <Clock className="mr-2 h-4 w-4" />
                {formData.eventTime
                  ? (() => {
                      const [h, m] = formData.eventTime.split(":");
                      const hour = parseInt(h);
                      const hour12 =
                        hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                      const period = hour < 12 ? "AM" : "PM";
                      return `${hour12}:${m} ${period}`;
                    })()
                  : "Pick a time"}
              </Button>

              {showTimePicker && (
                <div className="absolute top-full left-0 mt-1 z-50">
                  <TimePicker
                    value={formData.eventTime}
                    onChange={(time) =>
                      setFormData({ ...formData, eventTime: time })
                    }
                    onClose={() => setShowTimePicker(false)}
                  />
                </div>
              )}
            </div>
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

        {/* Honeypot Field */}
        <input
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: "none" }}
        />

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

      <div className="mt-2 w-full">
        <div className="flex justify-center w-full overflow-hidden">
          <div
            className="cf-turnstile w-full max-w-[300px]"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-theme="light"
            data-callback="onTurnstileSuccess"
            data-size="normal"
          />
        </div>

        {!scriptLoaded && (
          <p className="text-[.71rem] text-muted-foreground mt-2">
            CAPTCHA failed to load — please refresh the page.
          </p>
        )}
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
        By submitting this form, you agree to be contacted by Ultra Band Music
        regarding your event booking.
      </p>
    </form>
  );
}
