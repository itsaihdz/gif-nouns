import { NextRequest, NextResponse } from 'next/server';

interface VoteRequest {
  itemId: string;
  voter: {
    fid: number;
    username: string;
    pfp: string;
  };
  action: 'vote' | 'unvote';
}

// Mock database - in production, this would be a real database
let galleryItems = [
  {
    id: "1",
    votes: 42,
    voters: [
      { fid: 23456, username: "bob.noun", pfp: "https://picsum.photos/32/32?random=2" },
      { fid: 34567, username: "charlie.noun", pfp: "https://picsum.photos/32/32?random=3" },
      { fid: 45678, username: "diana.noun", pfp: "https://picsum.photos/32/32?random=4" }
    ]
  },
  {
    id: "2",
    votes: 38,
    voters: [
      { fid: 12345, username: "alice.noun", pfp: "https://picsum.photos/32/32?random=1" },
      { fid: 56789, username: "eve.noun", pfp: "https://picsum.photos/32/32?random=6" }
    ]
  }
];

export async function POST(request: NextRequest) {
  try {
    const body: VoteRequest = await request.json();
    const { itemId, voter, action } = body;

    // Validate required fields
    if (!itemId || !voter || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the item
    const item = galleryItems.find(item => item.id === itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if user has already voted
    const hasVoted = item.voters.some(v => v.fid === voter.fid);

    if (action === 'vote') {
      if (hasVoted) {
        return NextResponse.json(
          { success: false, error: 'User has already voted for this item' },
          { status: 400 }
        );
      }

      // Add vote
      item.votes += 1;
      item.voters.push(voter);
    } else if (action === 'unvote') {
      if (!hasVoted) {
        return NextResponse.json(
          { success: false, error: 'User has not voted for this item' },
          { status: 400 }
        );
      }

      // Remove vote
      item.votes -= 1;
      item.voters = item.voters.filter(v => v.fid !== voter.fid);
    }

    return NextResponse.json({
      success: true,
      data: {
        itemId,
        votes: item.votes,
        voters: item.voters,
        hasVoted: action === 'vote'
      },
      message: `Successfully ${action === 'vote' ? 'voted for' : 'unvoted from'} item`
    });
  } catch (error) {
    console.error('Vote POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process vote' },
      { status: 500 }
    );
  }
} 