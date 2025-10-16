// lib/youtube.ts
interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoUrl: string;
  viewCount?: number;
}

export async function getLatestYouTubeVideos(maxResults: number = 9): Promise<YouTubeVideo[]> {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  if (!API_KEY || !CHANNEL_ID) {
    console.error('YouTube API key or channel ID not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const videos = data.items?.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    })) || [];

    // Fetch view counts for sorting
    return await enrichVideosWithStats(videos, API_KEY);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}

async function enrichVideosWithStats(videos: YouTubeVideo[], apiKey: string): Promise<YouTubeVideo[]> {
  try {
    const videoIds = videos.map(v => v.id).join(',');
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) throw new Error('Failed to fetch video stats');

    const data = await response.json();
    const statsMap = new Map(
      data.items?.map((item: any) => [
        item.id,
        parseInt(item.statistics.viewCount || '0', 10),
      ]) || []
    );

    return videos.map(video => ({
      ...video,
      viewCount: statsMap.get(video.id) || 0,
    }));
  } catch (error) {
    console.error('Error enriching videos with stats:', error);
    return videos; // Return videos without view counts if stats fetch fails
  }
}

export function getMostViewedVideo(videos: YouTubeVideo[]): YouTubeVideo | null {
  if (!videos.length) return null;
  return videos.reduce((prev, current) => 
    ((current.viewCount || 0) > (prev.viewCount || 0)) ? current : prev
  );
}