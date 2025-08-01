import { NextRequest, NextResponse } from 'next/server';
import { galleryService } from '../../../lib/supabase-service';

// Mock data for fallback when Supabase is not available
const mockGalleryItems = [
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
    createdAt: "2024-01-15T11:15:00Z"
  }
];

export async function GET() {
  try {
    // Try to fetch from Supabase first
    const items = await galleryService.getAllItems();
    
    // Transform to match the frontend interface
    const transformedItems = items.map(item => ({
      id: item.id,
      gifUrl: item.gif_url,
      creator: {
        fid: item.creator_fid,
        username: item.creator_username,
        pfp: item.creator_pfp,
      },
      title: item.title,
      noggleColor: item.noggle_color,
      eyeAnimation: item.eye_animation,
      votes: item.votes,
      createdAt: item.created_at,
    }));

    return NextResponse.json(transformedItems);
  } catch (error) {
    console.error('Error fetching gallery items from Supabase:', error);
    
    // Fallback to mock data if Supabase is not available
    console.log('Falling back to mock gallery data');
    return NextResponse.json(mockGalleryItems);
  }
}

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
    const { gifUrl, creator, title, noggleColor, eyeAnimation } = body;

    const newItem = await galleryService.createItem({
      gifUrl,
      creatorFid: creator.fid,
      creatorUsername: creator.username,
      creatorPfp: creator.pfp,
      title,
      noggleColor,
      eyeAnimation,
    });

    // Transform to match the frontend interface
    const transformedItem = {
      id: newItem.id,
      gifUrl: newItem.gif_url,
      creator: {
        fid: newItem.creator_fid,
        username: newItem.creator_username,
        pfp: newItem.creator_pfp,
      },
      title: newItem.title,
      noggleColor: newItem.noggle_color,
      eyeAnimation: newItem.eye_animation,
      votes: newItem.votes,
      createdAt: newItem.created_at,
    };

    return NextResponse.json(transformedItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    
    // Fallback: return a mock item if Supabase is not available
    const mockItem = {
      id: Date.now().toString(),
      gifUrl: body?.gifUrl || "/api/generate-gif?demo=1",
      creator: body?.creator || {
        fid: 12345,
        username: "demo.noun",
        pfp: "https://picsum.photos/32/32?random=1"
      },
      title: body?.title || "Demo Creation",
      noggleColor: body?.noggleColor || "blue",
      eyeAnimation: body?.eyeAnimation || "nouns",
      votes: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(mockItem);
  }
} 