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
  isVoted?: boolean;
}

// TODO: Replace with real database (PostgreSQL, Supabase, etc.)
// For now, using in-memory storage with persistence to localStorage
class GalleryDatabase {
  private items: GalleryItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gallery_items');
      if (stored) {
        this.items = JSON.parse(stored);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gallery_items', JSON.stringify(this.items));
    }
  }

  async getAll(sortBy: string = 'votes', filterBy: string = 'all'): Promise<GalleryItem[]> {
    let filteredItems = [...this.items];

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

    return filteredItems;
  }

  async create(item: Omit<GalleryItem, 'id' | 'votes' | 'voters' | 'createdAt'>): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      ...item,
      id: Date.now().toString(),
      votes: 0,
      voters: [],
      createdAt: new Date().toISOString()
    };

    this.items.unshift(newItem); // Add to beginning
    this.saveToStorage();
    return newItem;
  }

  async vote(itemId: string, voter: { fid: number; username: string; pfp: string }): Promise<GalleryItem> {
    const item = this.items.find(i => i.id === itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    const hasVoted = item.voters.some(v => v.fid === voter.fid);
    if (hasVoted) {
      throw new Error('User has already voted');
    }

    item.votes += 1;
    item.voters.push(voter);
    this.saveToStorage();
    return item;
  }

  async unvote(itemId: string, voterFid: number): Promise<GalleryItem> {
    const item = this.items.find(i => i.id === itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    const hasVoted = item.voters.some(v => v.fid === voterFid);
    if (!hasVoted) {
      throw new Error('User has not voted');
    }

    item.votes -= 1;
    item.voters = item.voters.filter(v => v.fid !== voterFid);
    this.saveToStorage();
    return item;
  }

  async getById(id: string): Promise<GalleryItem | null> {
    return this.items.find(item => item.id === id) || null;
  }
}

const db = new GalleryDatabase();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'votes';
    const filterBy = searchParams.get('filterBy') || 'all';

    const items = await db.getAll(sortBy, filterBy);

    return NextResponse.json({
      success: true,
      data: items,
      total: items.length
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
    const newItem = await db.create({
      gifUrl,
      title,
      noggleColor,
      eyeAnimation,
      creator
    });

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