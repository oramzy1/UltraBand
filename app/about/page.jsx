import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Award, Calendar, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import Image from "next/image";
import { FAQSection } from "@/components/faq-section";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResponsiveTooltip } from "@/components/responsive-tooltip";

export default async function AboutPage() {
  const supabase = await createClient();

  const { data: aboutInfo } = await supabase
    .from("band_info")
    .select("*")
    .eq("section", "about")
    .single();

  const { data: bandMembers } = await supabase
    .from("band_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  const formattedMembers =
    bandMembers?.map((member, idx) => ({
      id: member.id ?? idx,
      name: member.name,
      designation: member.role || "Member",
      image: member.image_url || "/default-avatar.png",
    })) || [];

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-xl md:text-4xl font-bold sm:mb-6">
            About Ultra Band Music
          </h1>
          <p className="sm:text-xl text-muted-foreground text-pretty">
            Passionate musicians dedicated to creating unforgettable
            experiences!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 order-2 lg:order-1">
            <h2 className="sm:text-2xl font-semibold">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {aboutInfo?.content ||
                "Your ultimate choice for an Owambe live band experience that transcends the ordinary, and your premier destination for timeless live music experiences. Dive into the pulsating rhythms, infectious beats, and electrifying performances that will turn your Owambe into an unforgettable celebration."}
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              At Ultra Band Music Entertainment, we are the maestros of Owambe
              vibes in North America and beyond. We specialize in creating a
              musical experience that amplifies the joy and energy of your
              festivities. Our roots run deep in Afrobeat, Highlife, Juju, Old
              Skool, and other genres that define the rich cultural tapestry of
              celebrations.   
            </p>
          </div>

          <div className="relative order-1 lg:order-2">
            <Image
              loading="lazy"
              height={100}
              width={100}
              src={aboutInfo?.image_url || "/about-image.png"}
              alt="Ultra Band Music band"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-2 sm:p-6">
            <CardContent className="pt-2 sm:pt-6">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="sm:text-2xl font-bold">10+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Years Experience
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-2 sm:p-6">
            <CardContent className="pt-2 sm:pt-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="sm:text-2xl font-bold">500+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Events Performed
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-2 sm:p-6">
            <CardContent className="pt-2 sm:pt-6">
              <Music className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="sm:text-2xl font-bold">200+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Songs in Repertoire
              </div>
            </CardContent>
          </Card>

          <Card className="text-center p-2 sm:p-6">
            <CardContent className="pt-2 sm:pt-6">
              <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="sm:text-2xl font-bold">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Client Satisfaction
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TooltipProvider>
              {services?.map((service) => (
                <Link key={service.id} href={`/services/${service.slug}`}>
                  <Card className="p-2 sm:p-6 hover:shadow-lg transition">
                    <CardContent className="pt-6">
                      <Badge className="mb-4">{service.category}</Badge>
                      <h3 className="text-lg sm:text-xl font-semibold mb-3">
                        {service.title}
                      </h3>
                        <ResponsiveTooltip content={service.description}>
                          <p className="text-muted-foreground line-clamp-2 cursor-help text-xs sm:text-sm">
                            {service.description}
                          </p>
                        </ResponsiveTooltip>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </TooltipProvider>
          </div>
        </section>

        {/* Band Members */}
       {formattedMembers.length > 0 && (
         <div>
         <h2 className="sm:text-2xl font-bold text-center mb-12">
           Meet the Band
         </h2>
         <div className="flex flex-col md:flex-row items-center justify-center mb-10 w-full">
           <AnimatedTooltip items={formattedMembers} />
         </div>
       </div>
       )}
        {/* FAQS */}
        <FAQSection />
      </div>
    </div>
  );
}
