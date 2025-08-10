import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gifUrl, title, noggleColor, eyeAnimation, creatorFid, creatorUsername, creatorPfp } = body;

    // Validate required fields
    if (!gifUrl || !title || !noggleColor || !eyeAnimation || !creatorFid || !creatorUsername) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if gallery item already exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('gif_url', gifUrl)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching existing item:', fetchError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (existingItem) {
      // Update existing item - increment mint count
      const { data: updatedItem, error: updateError } = await supabase
        .from('gallery_items')
        .update({ 
          mint_count: existingItem.mint_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating gallery item:', updateError);
        return NextResponse.json(
          { error: 'Failed to update gallery item' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Mint count updated',
        galleryItem: updatedItem,
        mintCount: updatedItem.mint_count
      });
    } else {
      // Create new gallery item
      const { data: newItem, error: insertError } = await supabase
        .from('gallery_items')
        .insert({
          gif_url: gifUrl,
          title: title,
          noggle_color: noggleColor,
          eye_animation: eyeAnimation,
          creator_fid: creatorFid,
          creator_username: creatorUsername,
          creator_pfp: creatorPfp || '',
          mint_count: 1,
          upvotes: 0,
          downvotes: 0
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating gallery item:', insertError);
        return NextResponse.json(
          { error: 'Failed to create gallery item' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Gallery item created',
        galleryItem: newItem,
        mintCount: newItem.mint_count
      });
    }

  } catch (error) {
    console.error('NFT mint API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gifUrl = searchParams.get('gifUrl');

    if (!gifUrl) {
      return NextResponse.json(
        { error: 'GIF URL parameter required' },
        { status: 400 }
      );
    }

    // Get mint count for specific GIF
    const { data: item, error } = await supabase
      .from('gallery_items')
      .select('mint_count, upvotes, downvotes')
      .eq('gif_url', gifUrl)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ mintCount: 0, upvotes: 0, downvotes: 0 });
      }
      throw error;
    }

    return NextResponse.json({
      mintCount: item.mint_count || 0,
      upvotes: item.upvotes || 0,
      downvotes: item.downvotes || 0
    });

  } catch (error) {
    console.error('Error fetching mint count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
