import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { gifUrl, userFid, username, pfp, voteType } = await request.json();

    if (!gifUrl || !userFid || !username || !pfp || !voteType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔄 Processing vote for storage GIF:', { gifUrl, userFid, username, voteType });

    // First, find the gallery item by gifUrl
    const { data: item, error: itemError } = await supabase
      .from('gallery_items')
      .select('id, upvotes, downvotes')
      .eq('gif_url', gifUrl)
      .single();

    if (itemError) {
      console.log('❌ No gallery item found for GIF URL:', gifUrl);
      return NextResponse.json(
        { success: false, error: 'GIF not found in gallery' },
        { status: 404 }
      );
    }

    console.log('✅ Found gallery item:', item);

    // Check if user has already voted
    const { data: existingVote, error: voteCheckError } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('gallery_item_id', item.id)
      .eq('voter_fid', userFid)
      .single();

    let newUpvotes = item.upvotes;
    let newDownvotes = item.downvotes;

    if (voteCheckError && voteCheckError.code !== 'PGRST116') {
      console.error('Error checking existing vote:', voteCheckError);
      return NextResponse.json(
        { success: false, error: 'Failed to check existing vote' },
        { status: 500 }
      );
    }

    if (existingVote) {
      // User has already voted, update their vote
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking the same button
        await supabase
          .from('votes')
          .delete()
          .eq('gallery_item_id', item.id)
          .eq('voter_fid', userFid);

        // Update vote counts
        if (voteType === 'upvote') {
          newUpvotes = Math.max(0, newUpvotes - 1);
        } else {
          newDownvotes = Math.max(0, newDownvotes - 1);
        }
      } else {
        // Change vote
        await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('gallery_item_id', item.id)
          .eq('voter_fid', userFid);

        // Update vote counts
        if (voteType === 'upvote') {
          newUpvotes += 1;
          newDownvotes = Math.max(0, newDownvotes - 1);
        } else {
          newDownvotes += 1;
          newUpvotes = Math.max(0, newUpvotes - 1);
        }
      }
    } else {
      // New vote
      await supabase
        .from('votes')
        .insert({
          gallery_item_id: item.id,
          voter_fid: userFid,
          voter_username: username,
          voter_pfp: pfp,
          vote_type: voteType,
        });

      // Update vote counts
      if (voteType === 'upvote') {
        newUpvotes += 1;
      } else {
        newDownvotes += 1;
      }
    }

    // Update the gallery item vote counts
    const { error: updateError } = await supabase
      .from('gallery_items')
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq('id', item.id);

    if (updateError) {
      console.error('Error updating vote counts:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update vote counts' },
        { status: 500 }
      );
    }

    console.log('✅ Vote processed successfully:', { newUpvotes, newDownvotes });

    return NextResponse.json({
      success: true,
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      userVote: existingVote?.vote_type === voteType ? null : voteType,
    });
  } catch (error) {
    console.error('❌ Error processing vote:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process vote',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 