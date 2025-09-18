import { BookingForm } from "@/components/booking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Music, DollarSign, Users } from "lucide-react"

export default function BookingsPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Book The Midnight Echoes</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Ready to make your event unforgettable? Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Event Booking Request</CardTitle>
                <p className="text-muted-foreground">
                  Tell us about your event and we'll create a custom proposal for you.
                </p>
              </CardHeader>
              <CardContent>
                <BookingForm />
              </CardContent>
            </Card>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            {/* Event Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  Event Types We Cover
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Weddings</Badge>
                  <Badge variant="secondary">Corporate Events</Badge>
                  <Badge variant="secondary">Private Parties</Badge>
                  <Badge variant="secondary">Festivals</Badge>
                  <Badge variant="secondary">Birthday Parties</Badge>
                  <Badge variant="secondary">Anniversaries</Badge>
                  <Badge variant="secondary">Product Launches</Badge>
                  <Badge variant="secondary">Networking Events</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Small Events (up to 50 guests)</span>
                    <span className="font-semibold">$1,500 - $2,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medium Events (50-150 guests)</span>
                    <span className="font-semibold">$2,500 - $4,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Large Events (150+ guests)</span>
                    <span className="font-semibold">$4,000 - $7,000</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  * Prices vary based on event duration, location, and specific requirements. Custom quotes available.
                </p>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Professional sound system and equipment
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Lighting setup for ambiance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Microphones for announcements
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Customized playlist consultation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Professional setup and breakdown
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Backup equipment and contingency planning
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We typically respond to booking requests within 24 hours. For urgent requests, please call us directly
                  at{" "}
                  <a href="tel:+1-555-ECHOES" className="text-primary hover:underline">
                    +1-555-ECHOES
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
