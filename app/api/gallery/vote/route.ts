import { NextRequest, NextResponse } from 'next/server';
import { voteService, galleryService } from '../../../../lib/supabase-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, voter } = body;

    // Check if user has already voted
    const hasVoted = await voteService.hasUserVoted(itemId, voter.fid);
    
    if (hasVoted) {
      return NextResponse.json(
        { error: 'User has already voted for this item' },
        { status: 400 }
      );
    }

    // Add the vote
    await voteService.addVote({
      galleryItemId: itemId,
      voterFid: voter.fid,
      voterUsername: voter.username,
      voterPfp: voter.pfp,
    });

    // Get updated vote count
    const votes = await voteService.getVotesForItem(itemId);
    const voteCount = votes.length;

    // Update the gallery item vote count
    await galleryService.updateVoteCount(itemId, voteCount);

    return NextResponse.json({
      success: true,
      voteCount,
      message: 'Vote added successfully'
    });
  } catch (error) {
    console.error('Error adding vote:', error);
    return NextResponse.json(
      { error: 'Failed to add vote' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, voterFid } = body;

    // Check if user has voted
    const hasVoted = await voteService.hasUserVoted(itemId, voterFid);
    
    if (!hasVoted) {
      return NextResponse.json(
        { error: 'User has not voted for this item' },
        { status: 400 }
      );
    }

    // Remove the vote
    await voteService.removeVote(itemId, voterFid);

    // Get updated vote count
    const votes = await voteService.getVotesForItem(itemId);
    const voteCount = votes.length;

    // Update the gallery item vote count
    await galleryService.updateVoteCount(itemId, voteCount);

    return NextResponse.json({
      success: true,
      voteCount,
      message: 'Vote removed successfully'
    });
  } catch (error) {
    console.error('Error removing vote:', error);
    return NextResponse.json(
      { error: 'Failed to remove vote' },
      { status: 500 }
    );
  }
} 