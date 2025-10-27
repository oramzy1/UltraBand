// components/youtube-video-selection.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { toast } from "sonner";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoUrl: string;
  viewCount?: number;
}

export function YouTubeVideoSelection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      await fetchVideos();
      await fetchSelectedVideo();
    };
    init();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/admin/youtube-videos");
      if (!response.ok) throw new Error("Failed to fetch videos");
      
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to fetch YouTube videos");
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedVideo = async () => {
    try {
      const response = await fetch("/api/admin/featured-video");
      const data = await response.json();
      if (data.videoId) {
        setSelectedVideoId(data.videoId);
      }
    } catch (error) {
      console.error("Error fetching selected video:", error);
    }
  };

  const handleSelectVideo = async (videoId: string) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/featured-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) throw new Error("Failed to save selection");

      setSelectedVideoId(videoId);
      toast.success("Featured video updated");
    } catch (error) {
      console.error("Error saving featured video:", error);
      toast.error("Failed to save featured video");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading videos...</p>
        </CardContent>
      </Card>
    );
  }

  if (!videos.length) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No videos found. Make sure your YouTube channel is connected.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg md:text-2xl font-semibold mb-2">Featured Video</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a video to display on the homepage. If none is selected, the most viewed video will be shown.
        </p>
      </div>
      {selectedVideoId && (
        <div className="mt-6 flex justify-end">
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={async () => {
              try {
                const response = await fetch("/api/admin/featured-video", {
                  method: "DELETE",
                });
                if (!response.ok) throw new Error("Failed to clear selection");
                setSelectedVideoId(null);
                toast.success("Featured video selection cleared. Most viewed will be shown.");
              } catch (error) {
                toast.error("Failed to clear selection");
              }
            }}
          >
            Clear Selection
          </Button>
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {videos.map((video) => (
          <Card
            key={video.id}
            className={`overflow-hidden cursor-pointer transition-all ${
              selectedVideoId === video.id
                ? "ring-2 ring-primary"
                : "hover:shadow-lg"
            }`}
          >
            <div className="aspect-video relative group">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>

              {selectedVideoId === video.id && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
              )}
            </div>

            <CardContent className="p-3 space-y-2">
              <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </p>
                  {video.viewCount !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      {(video.viewCount / 1000).toFixed(0)}K views
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={selectedVideoId === video.id ? "default" : "outline"}
                  onClick={() => handleSelectVideo(video.id)}
                  disabled={saving}
                  className="whitespace-nowrap cursor-pointer"
                >
                  {selectedVideoId === video.id ? "Selected" : "Select"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    
    </div>
  );
}