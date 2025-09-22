import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Award, Calendar, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AboutPage() {
  const supabase = await createClient();

  const { data: aboutInfo } = await supabase
    .from("band_info")
    .select("*")
    .eq("section", "about")
    .single();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Ultra Band
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Passionate musicians dedicated to creating unforgettable experiences!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              {aboutInfo?.content ||
                "Introducing Ultra Band Entertainment – your ultimate choice for an Owambe live band experience that transcends the ordinary, and your premier destination for timeless live music experiences. Dive into the pulsating rhythms, infectious beats, and electrifying performances that will turn your Owambe into an unforgettable celebration."}
            </p>
            <p className="text-muted-foreground leading-relaxed">
            At Ultra Band Entertainment, we are the maestros of Owambe vibes in North America and beyond. We specialize in creating a musical experience that amplifies the joy and energy of your festivities. Our roots run deep in Afrobeat, Highlife, Juju, Old Skool, and other genres that define the rich cultural tapestry of celebrations.
            </p>
          </div>

          <div className="relative">
            <img
              src={
                aboutInfo?.image_url ||
                "/placeholder.svg?height=500&width=600&query=professional band members with instruments"
              }
              alt="Ultra Band band members"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">10+</div>
              <div className="text-sm text-muted-foreground">
                Years Experience
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">
                Events Performed
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Music className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">200+</div>
              <div className="text-sm text-muted-foreground">
                Songs in Repertoire
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">
                Client Satisfaction
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="pt-6">
                <Badge className="mb-4">Weddings</Badge>
                <h3 className="text-xl font-semibold mb-3">
                  Wedding Celebrations
                </h3>
                <p className="text-muted-foreground">
                  From intimate ceremonies to grand receptions, we provide the
                  perfect soundtrack for your special day with romantic ballads
                  and dance favorites.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <Badge className="mb-4">Corporate</Badge>
                <h3 className="text-xl font-semibold mb-3">Corporate Events</h3>
                <p className="text-muted-foreground">
                  Professional entertainment for company parties, product
                  launches, and networking events that creates the right
                  atmosphere for your business.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <Badge className="mb-4">Private</Badge>
                <h3 className="text-xl font-semibold mb-3">Private Parties</h3>
                <p className="text-muted-foreground">
                  Birthday celebrations, anniversaries, and family gatherings
                  made memorable with personalized music selections and engaging
                  performances.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <Badge className="mb-4">Festivals</Badge>
                <h3 className="text-xl font-semibold mb-3">
                  Festivals & Public Events
                </h3>
                <p className="text-muted-foreground">
                  High-energy performances for festivals, community events, and
                  public celebrations that captivate large audiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Band Members */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet the Band
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                  <Music className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Alex Rivera</h3>
                <p className="text-primary mb-2">Lead Vocalist & Guitar</p>
                <p className="text-sm text-muted-foreground">
                  With 15 years of experience, Alex brings powerful vocals and
                  masterful guitar work to every performance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                  <Music className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sarah Chen</h3>
                <p className="text-primary mb-2">Bass & Backing Vocals</p>
                <p className="text-sm text-muted-foreground">
                  Sarah's rhythmic foundation and harmonious backing vocals add
                  depth and richness to our sound.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                  <Music className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Marcus Johnson</h3>
                <p className="text-primary mb-2">Drums & Percussion</p>
                <p className="text-sm text-muted-foreground">
                  Marcus drives the energy with his dynamic drumming and keeps
                  the crowd moving with infectious rhythms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
