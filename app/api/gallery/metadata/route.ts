import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Fetching all GIF metadata from gallery_items table...');

    // Fetch all GIF metadata from the gallery_items table
    const { data, error } = await supabase
      .from('gallery_items')
      .select('gif_url, title, noggle_color, eye_animation, upvotes, downvotes, creator_wallet')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching metadata from database:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch metadata from database' },
        { status: 500 }
      );
    }

    console.log(`✅ Fetched ${data.length} GIF metadata records from database`);

    // Transform the data to match the frontend expectations
    const metadata = data.map(item => ({
      gifUrl: item.gif_url,
      title: item.title,
      noggleColor: item.noggle_color,
      eyeAnimation: item.eye_animation,
      upvotes: item.upvotes || 0,
      downvotes: item.downvotes || 0,
      creatorWallet: item.creator_wallet
    }));

    return NextResponse.json({
      success: true,
      count: metadata.length,
      data: metadata
    });

  } catch (error) {
    console.error('❌ Error in metadata API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch metadata',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
