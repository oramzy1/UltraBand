import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  const featuredItems = galleryItems?.filter((item) => item.is_featured) || [];
  const regularItems = galleryItems?.filter((item) => !item.is_featured) || [];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Gallery</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Experience Ultra Band through our collection of performance photos
            and videos
          </p>
        </div>

        {/* Featured Section */}
        {featuredItems.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold">Featured</h2>
              <Badge variant="secondary">Highlights</Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-video relative">
                    {item.media_type === "image" ? (
                      <>
                        <img
                          src={item.media_url || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </>
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          src={item.media_url}
                          className="w-full h-full object-cover"
                          poster={item.media_url}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Button
                            size="lg"
                            className="rounded-full h-16 w-16 p-0"
                          >
                            <Play className="h-6 w-6 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-primary/90">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Gallery Items */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold">All Media</h2>
            <Badge variant="outline">{galleryItems?.length || 0} Items</Badge>
          </div>

          {regularItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-video relative">
                    {item.media_type === "image" ? (
                      <>
                        <img
                          src={item.media_url || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </>
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          src={item.media_url}
                          className="w-full h-full object-cover"
                          poster={item.media_url}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Button
                            size="sm"
                            className="rounded-full h-12 w-12 p-0"
                          >
                            <Play className="h-4 w-4 ml-0.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Gallery Items</h3>
                <p className="text-muted-foreground">
                  Check back soon for photos and videos from our performances.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold mb-4">Want to see us live?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Book Ultra Band for your next event and create memories that
                will last a lifetime.
              </p>
              <Button asChild size="lg">
                <a href="/bookings">Book Us Now</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
