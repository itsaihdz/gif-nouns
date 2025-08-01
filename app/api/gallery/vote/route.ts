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
const galleryItems = [
  {
    id: "1",
    gifUrl: "/api/generate-gif?demo=1",
    creator: {
      fid: 12345,
      username: "alice.noun",
      pfp: "https://picsum.photos/32/32?random=1"
    },
    title: "Cosmic Blue Explorer",
    noggleColor: "blue",
    eyeAnimation: "nouns",
    votes: 42,
    voters: [
      { fid: 23456, username: "bob.noun", pfp: "https://picsum.photos/32/32?random=2" },
      { fid: 34567, username: "charlie.noun", pfp: "https://picsum.photos/32/32?random=3" },
      { fid: 45678, username: "diana.noun", pfp: "https://picsum.photos/32/32?random=4" }
    ],
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    gifUrl: "/api/generate-gif?demo=2",
    creator: {
      fid: 23456,
      username: "bob.noun",
      pfp: "https://picsum.photos/32/32?random=5"
    },
    title: "Grass Green Dreamer",
    noggleColor: "grass",
    eyeAnimation: "viscos",
    votes: 38,
    voters: [
      { fid: 12345, username: "alice.noun", pfp: "https://picsum.photos/32/32?random=1" },
      { fid: 56789, username: "eve.noun", pfp: "https://picsum.photos/32/32?random=6" }
    ],
    createdAt: "2024-01-15T11:15:00Z"
  }
];

export async function POST(request: NextRequest) {
  try {
    const body: VoteRequest = await request.json();
    const { itemId, voter, action } = body;

    const item = galleryItems.find(item => item.id === itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    if (action === 'vote') {
      // Check if user already voted
      const hasVoted = item.voters.some(v => v.fid === voter.fid);
      if (hasVoted) {
        return NextResponse.json(
          { success: false, error: 'User has already voted' },
          { status: 400 }
        );
      }

      item.votes += 1;
      item.voters.push(voter);
    } else if (action === 'unvote') {
      // Check if user has voted
      const hasVoted = item.voters.some(v => v.fid === voter.fid);
      if (!hasVoted) {
        return NextResponse.json(
          { success: false, error: 'User has not voted' },
          { status: 400 }
        );
      }

      item.votes -= 1;
      item.voters = item.voters.filter(v => v.fid !== voter.fid);
    }

    return NextResponse.json({
      success: true,
      data: item,
      message: `Successfully ${action}d`
    });

  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process vote' },
      { status: 500 }
    );
  }
} 