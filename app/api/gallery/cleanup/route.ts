import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST() {
  try {
    console.log('🧹 Starting gallery cleanup...');
    
    // Delete mock items
    const { data, error } = await supabase
      .from('gallery_items')
      .delete()
      .or('gif_url.like./api/generate-gif?demo%,gif_url.like.https://ipfs.io/ipfs/test%,creator_username.eq.alice.noun,creator_username.eq.bob.noun')
      .select();

    if (error) {
      console.error('❌ Error cleaning up gallery:', error);
      return NextResponse.json({ error: 'Failed to cleanup gallery' }, { status: 500 });
    }

    console.log('✅ Gallery cleanup completed. Deleted items:', data?.length || 0);
    
    // Get remaining items
    const { data: remainingItems, error: fetchError } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching remaining items:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch remaining items' }, { status: 500 });
    }

    console.log('📊 Remaining items in gallery:', remainingItems?.length || 0);
    
    return NextResponse.json({ 
      success: true, 
      deletedCount: data?.length || 0,
      remainingCount: remainingItems?.length || 0,
      remainingItems: remainingItems?.map(item => ({
        id: item.id,
        gifUrl: item.gif_url,
        title: item.title,
        creator: item.creator_username
      }))
    });
  } catch (error) {
    console.error('❌ Gallery cleanup error:', error);
    return NextResponse.json({ error: 'Failed to cleanup gallery' }, { status: 500 });
  }
} 