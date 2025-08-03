import { NextRequest, NextResponse } from 'next/server';
import { galleryService } from '../../../lib/supabase-service';

export async function GET() {
  try {
    // Fetch from Supabase
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
      upvotes: item.upvotes,
      downvotes: item.downvotes,
      createdAt: item.created_at,
    }));

    return NextResponse.json(transformedItems);
  } catch (error) {
    console.error('Error fetching gallery items from Supabase:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      upvotes: newItem.upvotes,
      downvotes: newItem.downvotes,
      createdAt: newItem.created_at,
    };

    return NextResponse.json(transformedItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
} 