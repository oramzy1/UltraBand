interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    videoUrl: string;
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
        { next: { revalidate: 3600 } } // Cache for 1 hour
      );
  
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
  
      const data = await response.json();
      
      return data.items?.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
      })) || [];
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  }