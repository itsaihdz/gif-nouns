import { NextRequest, NextResponse } from 'next/server';
import { getAllGifsFromStorage } from '@/lib/supabase-storage';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 API: Fetching all GIFs from storage...');
    
    const gifs = await getAllGifsFromStorage();
    
    console.log(`✅ API: Returning ${gifs.length} GIFs from storage`);
    
    return NextResponse.json({
      success: true,
      data: gifs,
      count: gifs.length
    });
  } catch (error) {
    console.error('❌ API: Error fetching GIFs from storage:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch GIFs from storage',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 