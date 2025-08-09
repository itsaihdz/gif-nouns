import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { gifUrl, userFid, username, voteType } = await request.json();

    if (!gifUrl || !userFid || !username || !voteType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔄 Processing vote for storage GIF:', { gifUrl, userFid, username, voteType });

    // First, try to find the gallery item by gifUrl
    let item;
    const { data: existingItem, error: itemError } = await supabase
      .from('gallery_items')
      .select('id, upvotes, downvotes')
      .eq('gif_url', gifUrl)
      .single();

    // If no gallery item exists, create one automatically
    if (itemError) {
      console.log('🔄 No gallery item found for GIF URL, creating one:', gifUrl);
      
      // Extract filename from URL for title
      const urlParts = gifUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      
      // Create a new gallery item
      const { data: newItem, error: createError } = await supabase
        .from('gallery_items')
        .insert({
          gif_url: gifUrl,
          creator_fid: userFid, // Use voter as creator for now
          creator_username: username,
          creator_pfp: '',
          title: filename,
          noggle_color: 'unknown',
          eye_animation: 'unknown',
          upvotes: 0,
          downvotes: 0,
        })
        .select('id, upvotes, downvotes')
        .single();

      if (createError) {
        console.error('❌ Error creating gallery item:', createError);
        return NextResponse.json(
          { success: false, error: 'Failed to create gallery item' },
          { status: 500 }
        );
      }

      item = newItem;
      console.log('✅ Created new gallery item:', item);
    } else {
      item = existingItem;
      console.log('✅ Found existing gallery item:', item);
    }

    // Ensure we have a valid item
    if (!item) {
      console.error('❌ No gallery item available for voting');
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    // Check if user has already voted
    console.log('🔍 Checking existing vote for:', { gallery_item_id: item.id, voter_fid: userFid });
    
    const { data: existingVote, error: voteCheckError } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('gallery_item_id', item.id)
      .eq('voter_fid', userFid)
      .single();
    
    console.log('🔍 Existing vote result:', { existingVote, voteCheckError: voteCheckError?.code });

    // Ensure user exists in the users table (upsert)
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        fid: userFid,
        username: username,
        display_name: username, // Use username as display_name
        pfp: '', // Temporary: provide empty string until schema is updated

      }, {
        onConflict: 'fid'
      });

    if (userError) {
      console.error('❌ Error upserting user:', userError);
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

    let newUpvotes = item.upvotes;
    let newDownvotes = item.downvotes;
    let finalUserVote: 'upvote' | 'downvote' | null = null;

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
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .eq('gallery_item_id', item.id)
          .eq('voter_fid', userFid);

        if (deleteError) {
          console.error('❌ Error deleting vote:', deleteError);
          return NextResponse.json(
            { success: false, error: 'Failed to remove vote' },
            { status: 500 }
          );
        }

        // Update vote counts
        if (voteType === 'upvote') {
          newUpvotes = Math.max(0, newUpvotes - 1);
        } else {
          newDownvotes = Math.max(0, newDownvotes - 1);
        }
        
        finalUserVote = null; // Vote was removed
      } else {
        // Change vote
        const { error: updateError } = await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('gallery_item_id', item.id)
          .eq('voter_fid', userFid);

        if (updateError) {
          console.error('❌ Error updating vote:', updateError);
          return NextResponse.json(
            { success: false, error: 'Failed to update vote' },
            { status: 500 }
          );
        }

        // Update vote counts
        console.log('🔄 Vote change detected:', { 
          oldVote: existingVote.vote_type, 
          newVote: voteType, 
          currentUpvotes: newUpvotes, 
          currentDownvotes: newDownvotes 
        });
        
        if (voteType === 'upvote') {
          newUpvotes += 1;
          newDownvotes = Math.max(0, newDownvotes - 1);
        } else {
          newDownvotes += 1;
          newUpvotes = Math.max(0, newUpvotes - 1);
        }
        
        console.log('🔄 After vote change:', { 
          newUpvotes, 
          newDownvotes 
        });
        
        finalUserVote = voteType; // Vote was changed
      }
    } else {
      // New vote
      const { error: insertError } = await supabase
        .from('votes')
        .insert({
          gallery_item_id: item.id,
          voter_fid: userFid,
          voter_username: username,
          voter_pfp: '', // Temporary: provide empty string until schema is updated
          vote_type: voteType,
        });

      if (insertError) {
        console.error('❌ Error inserting vote:', insertError);
        // If there's a unique constraint violation, it means user already voted
        // This could be a race condition, so let's check again
        if (insertError.code === '23505') { // Unique constraint violation
          return NextResponse.json(
            { success: false, error: 'You have already voted on this item' },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { success: false, error: 'Failed to insert vote' },
          { status: 500 }
        );
      }

      // Update vote counts
      if (voteType === 'upvote') {
        newUpvotes += 1;
      } else {
        newDownvotes += 1;
      }
      
      finalUserVote = voteType; // New vote was added
    }

    // Get actual vote counts from the votes table instead of relying on our calculations
    const { data: actualVotes, error: voteCountError } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('gallery_item_id', item.id);

    if (voteCountError) {
      console.error('Error getting vote counts:', voteCountError);
      return NextResponse.json(
        { success: false, error: 'Failed to get vote counts' },
        { status: 500 }
      );
    }

    const actualUpvotes = actualVotes.filter(v => v.vote_type === 'upvote').length;
    const actualDownvotes = actualVotes.filter(v => v.vote_type === 'downvote').length;

    console.log('📊 Vote counts comparison:', { 
      calculated: { newUpvotes, newDownvotes }, 
      actual: { actualUpvotes, actualDownvotes } 
    });

    // Update the gallery item vote counts with actual counts
    const { error: updateError } = await supabase
      .from('gallery_items')
      .update({ upvotes: actualUpvotes, downvotes: actualDownvotes })
      .eq('id', item.id);

    if (updateError) {
      console.error('Error updating vote counts:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update vote counts' },
        { status: 500 }
      );
    }

    console.log('✅ Vote processed successfully:', { actualUpvotes, actualDownvotes });

    return NextResponse.json({
      success: true,
      upvotes: actualUpvotes,
      downvotes: actualDownvotes,
      userVote: finalUserVote,
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