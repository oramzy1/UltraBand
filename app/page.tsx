import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TypedHeroTitle from '@/components/TypedHeroTitle'
import { Calendar, MapPin, Music, Users, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FocusCards } from "@/components/ui/focus-cards";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch band info and upcoming events
  const { data: bandInfo } = await supabase
    .from("band_info")
    .select("*")
    .in("section", ["hero", "about"]);

  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_public", true)
    .gte("event_date", new Date().toISOString().split("T")[0])
    .order("event_date", { ascending: true })
    .limit(3);

  const { data: featuredGallery } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_featured", true)
    .limit(3);

  const heroInfo = bandInfo?.find((info) => info.section === "hero");
  const aboutInfo = bandInfo?.find((info) => info.section === "about");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${
              heroInfo?.image_url ||
              "/dark-concert-stage-with-purple-lighting.jpg"
            }')`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-2xl md:text-6xl font-bold mb-2 text-balance">
            {/* {heroInfo?.title || "Ultra Band"} */}
            <TypedHeroTitle defaultText={heroInfo?.title || "Welcome Home!"} />
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground text-pretty max-w-2xl mx-auto">
            {heroInfo?.content ||
              "Professional live music that captivates audiences and also creates unforgettable experiences for your special events."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="animate-pulse-glow">
              <Link href="/bookings">
                Book Us Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Ultra Band?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Professional musicians with years of experience creating memorable
              moments!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Music className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  Versatile Repertoire
                </h3>
                <p className="text-muted-foreground">
                  From rock and pop to jazz and acoustic sets, we adapt to any
                  event atmosphere
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  Professional Experience
                </h3>
                <p className="text-muted-foreground">
                  Over 10 years performing at weddings, corporate events, and
                  festivals
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  Unforgettable Performances
                </h3>
                <p className="text-muted-foreground">
                  High-energy shows that keep your guests engaged and dancing
                  all night
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Upcoming Events
              </h2>
              <p className="text-xl text-muted-foreground">
                Join us at our next performances
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <Badge className="mb-3">Live Performance</Badge>
                    <h3 className="text-xl font-semibold mb-2">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {new Date(event.event_date).toLocaleDateString()} at{" "}
                          {event.event_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    {event.ticket_url && (
                      <Button
                        asChild
                        className="w-full mt-4 bg-transparent"
                        variant="outline"
                      >
                        <a
                          href={event.ticket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Get Tickets
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Gallery Preview */}
      {/* {featuredGallery && featuredGallery.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See Us in Action
              </h2>
              <p className="text-xl text-muted-foreground">
                Highlights from our recent performances
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredGallery.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative">
                    <img
                      src={item.media_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/gallery">View Full Gallery</Link>
              </Button>
            </div>
          </div>
        </section>
      )} */}

{featuredGallery && featuredGallery.length > 0 && (
  <section className="py-20 px-4">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          See Us in Action
        </h2>
        <p className="text-xl text-muted-foreground">
          Highlights from our recent performances
        </p>
      </div>

      <FocusCards
        cards={featuredGallery.map((item) => ({
          title: item.title,
          description: item.description,
          src: item.media_url || "/placeholder.svg",
        }))}
      />

      <div className="text-center mt-8">
        <Button asChild variant="outline">
          <Link href="/gallery">View Full Gallery</Link>
        </Button>
      </div>
    </div>
  </section>
)}


      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Book Your Event?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Let's create an unforgettable musical experience for your special
            occasion
          </p>
          <Button asChild size="lg" className="animate-pulse-glow">
            <Link href="/bookings">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
