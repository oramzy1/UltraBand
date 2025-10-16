// app/api/admin/featured-video-display/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLatestYouTubeVideos } from '@/lib/youtube';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get selected featured video ID
    const { data: featuredData } = await supabase
      .from('featured_videos')
      .select('video_id')
      .eq('is_selected', true)
      .single();

    const selectedVideoId = featuredData?.video_id;

    // Fetch all videos from YouTube
    const allVideos = await getLatestYouTubeVideos(50);

    if (!allVideos.length) {
      return NextResponse.json({ video: null });
    }

    let videoToDisplay = null;

    if (selectedVideoId) {
      // Try to find the selected video
      videoToDisplay = allVideos.find(v => v.id === selectedVideoId) || null;
    }

    // Fallback to most viewed
    if (!videoToDisplay) {
      videoToDisplay = allVideos.sort((a, b) => 
        (b.viewCount || 0) - (a.viewCount || 0)
      )[0];
    }

    return NextResponse.json({ video: videoToDisplay });
  } catch (error) {
    console.error('Error fetching featured video display:', error);
    return NextResponse.json({ video: null }, { status: 500 });
  }
}