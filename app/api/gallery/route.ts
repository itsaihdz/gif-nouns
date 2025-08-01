import { NextRequest, NextResponse } from 'next/server';

interface GalleryItem {
  id: string;
  gifUrl: string;
  creator: {
    fid: number;
    username: string;
    pfp: string;
  };
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  votes: number;
  voters: Array<{
    fid: number;
    username: string;
    pfp: string;
  }>;
  createdAt: string;
}

// Mock database - in production, this would be a real database
let galleryItems: GalleryItem[] = [
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'votes';
    const filterBy = searchParams.get('filterBy') || 'all';

    let filteredItems = [...galleryItems];

    // Apply filters
    if (filterBy !== 'all') {
      filteredItems = filteredItems.filter(item => 
        item.noggleColor === filterBy || item.eyeAnimation === filterBy
      );
    }

    // Apply sorting
    filteredItems.sort((a, b) => {
      if (sortBy === 'votes') {
        return b.votes - a.votes;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return NextResponse.json({
      success: true,
      data: filteredItems,
      total: filteredItems.length
    });
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gifUrl, title, noggleColor, eyeAnimation, creator } = body;

    // Validate required fields
    if (!gifUrl || !title || !noggleColor || !eyeAnimation || !creator) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new gallery item
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      gifUrl,
      title,
      noggleColor,
      eyeAnimation,
      creator,
      votes: 0,
      voters: [],
      createdAt: new Date().toISOString()
    };

    galleryItems.push(newItem);

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'GIF uploaded to gallery successfully'
    });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload to gallery' },
      { status: 500 }
    );
  }
} 