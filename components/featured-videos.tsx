// components/featured-videos.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, ImageIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoUrl: string;
  viewCount?: number;
}

function VideoPlayer({ video, isOpen, onClose }: any) {
  if (!video) return null;

  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(video.videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[95vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-4 pb-2 flex-shrink-0">
          <DialogTitle className="text-lg font-semibold pr-8">
            {video.title}
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 overflow-hidden">
          <div className="w-full h-full">
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <div className="flex items-center justify-between gap-4">
              {/* <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  Published {new Date(video.publishedAt).toLocaleDateString()}
                </p>
              </div> */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2"
              >
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Watch on YouTube
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FeaturedVideos() {
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVideo();
  }, []);

  const fetchFeaturedVideo = async () => {
    try {
      const response = await fetch("/api/admin/featured-video-display");
      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      setVideo(data.video || null);
    } catch (error) {
      console.error("Error fetching featured video:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            {/* <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Video</h2> */}
          </div>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground animate-pulse">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!video) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            {/* <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Video</h2> */}
          </div>
          <Card>
            <CardContent className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Featured Video</h3>
              <p className="text-muted-foreground">
                Featured video will appear here soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Video</h2>
          <p className="text-xl text-muted-foreground">
            Our latest performance and highlights
          </p>
        </div> */}

        <div className="max-w-5xl mx-auto">
          <Card
            className="overflow-hidden hover:shadow-lg transition-shadow group"
          > <div className="aspect-video relative w-[95%] mx-auto rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoUrl.split("v=")[1]}?autoplay=0&rel=0&modestbranding=1`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
            <CardContent className="px-4 py-2">
              <h3 className="font-medium text-lg mb-2 line-clamp-2">
                {video.title}
              </h3>
             <div className="flex justify-between items-center">
             <p className="text-sm text-muted-foreground">
                Published {new Date(video.publishedAt).toLocaleDateString()}
              </p>
              <Button asChild variant="outline" className="gap-2">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Watch on YouTube
                </a>
              </Button>
             </div>
            </CardContent>
          </Card>
        </div>

        {/* <div className="text-center mt-8">
          <Button asChild variant="ghost">
            <Link href="/gallery">View More Videos</Link>
          </Button>
        </div> */}
      </div>

      <VideoPlayer
        video={video}
        isOpen={playerOpen}
        onClose={() => setPlayerOpen(false)}
      />
    </section>
  );
}