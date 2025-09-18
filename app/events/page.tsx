import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { createClient } from "@/lib/supabase/server";

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: allEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_public", true)
    .order("event_date", { ascending: true });

  const now = new Date();
  const upcomingEvents =
    allEvents?.filter((event) => isAfter(new Date(event.event_date), now)) ||
    [];
  const pastEvents =
    allEvents?.filter((event) => isBefore(new Date(event.event_date), now)) ||
    [];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Events</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Join us at our upcoming performances and experience Ultra Band live
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Badge variant="secondary">{upcomingEvents.length} Events</Badge>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-2">
                          {event.title}
                        </CardTitle>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                          Upcoming
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {format(
                            new Date(event.event_date),
                            "EEEE, MMMM do, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{event.event_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <div>
                          <div>{event.venue}</div>
                          {event.venue_address && (
                            <div className="text-xs text-muted-foreground">
                              {event.venue_address}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {event.ticket_url && (
                      <Button asChild className="w-full">
                        <a
                          href={event.ticket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Get Tickets
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-muted-foreground mb-4">
                  We're currently planning our next performances. Check back
                  soon or book us for your event!
                </p>
                <Button asChild>
                  <a href="/bookings">Book Us for Your Event</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold">Past Events</h2>
              <Badge variant="outline">{pastEvents.length} Events</Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.slice(0, 6).map((event) => (
                <Card
                  key={event.id}
                  className="opacity-75 hover:opacity-100 transition-opacity"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-2">
                          {event.title}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          Past Event
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(event.event_date), "MMMM do, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {pastEvents.length > 6 && (
              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground">
                  Showing {Math.min(6, pastEvents.length)} of{" "}
                  {pastEvents.length} past events
                </p>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold mb-4">
                Want us at your event?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We're always excited to perform at new venues and create
                unforgettable experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="/bookings">Book Us Now</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/gallery">View Gallery</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
