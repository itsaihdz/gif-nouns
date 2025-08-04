import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gifUrl = searchParams.get('gifUrl');
    
    if (!gifUrl) {
      return NextResponse.json(
        { success: false, error: 'gifUrl parameter is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Looking up creator info for GIF:', gifUrl);

    // Try to find the GIF in the gallery_items table
    const { data, error } = await supabase
      .from('gallery_items')
      .select('creator_username, creator_pfp, title, noggle_color, eye_animation, upvotes, downvotes')
      .eq('gif_url', gifUrl)
      .single();

    if (error) {
      console.log('❌ No creator info found in database for:', gifUrl);
      // Return default creator info
      return NextResponse.json({
        success: true,
        data: {
          creator: {
            username: 'Unknown Creator',
            pfp: 'https://picsum.photos/32/32?random=unknown',
          },
          title: 'Animated Noun',
          noggleColor: 'unknown',
          eyeAnimation: 'unknown',
          upvotes: 0,
          downvotes: 0,
          hasCreatorInfo: false
        }
      });
    }

    console.log('✅ Found creator info:', data);

    return NextResponse.json({
      success: true,
      data: {
        creator: {
          username: data.creator_username,
          pfp: data.creator_pfp,
        },
        title: data.title,
        noggleColor: data.noggle_color,
        eyeAnimation: data.eye_animation,
        upvotes: data.upvotes,
        downvotes: data.downvotes,
        hasCreatorInfo: true
      }
    });
  } catch (error) {
    console.error('❌ Error looking up creator info:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to look up creator info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 