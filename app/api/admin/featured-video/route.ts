// app/api/admin/featured-video/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('featured_videos')
      .select('video_id')
      .eq('is_selected', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ videoId: data?.video_id || null });
  } catch (error) {
    console.error('Error fetching featured video:', error);
    return NextResponse.json({ videoId: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
    }

    // Deselect all previous selections
    await supabase
      .from('featured_videos')
      .update({ is_selected: false })
      .eq('is_selected', true);

    // Check if video already exists
    const { data: existing } = await supabase
      .from('featured_videos')
      .select('id')
      .eq('video_id', videoId)
      .single();

    if (existing) {
      await supabase
        .from('featured_videos')
        .update({ is_selected: true, selected_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('featured_videos')
        .insert({
          video_id: videoId,
          is_selected: true,
          selected_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving featured video:', error);
    return NextResponse.json({ error: 'Failed to save featured video' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    
    await supabase
      .from('featured_videos')
      .update({ is_selected: false })
      .eq('is_selected', true);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing featured video:', error);
    return NextResponse.json({ error: 'Failed to clear selection' }, { status: 500 });
  }
}