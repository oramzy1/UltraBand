// app/api/admin/youtube-videos/route.ts
import { NextResponse } from 'next/server';
import { getLatestYouTubeVideos } from '@/lib/youtube';

export async function GET() {
  try {
    // Fetch up to 50 videos (can be adjusted)
    const videos = await getLatestYouTubeVideos(50);
    
    // Sort by view count descending
    const sortedVideos = videos.sort((a, b) => 
      (b.viewCount || 0) - (a.viewCount || 0)
    );

    return NextResponse.json(sortedVideos);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube videos' },
      { status: 500 }
    );
  }
}