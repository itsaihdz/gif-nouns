import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing basic Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('gallery_items').select('count').limit(1);
    
    if (error) {
      console.log('❌ Supabase connection error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        connection: 'failed'
      });
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test storage access (without creating bucket)
    try {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('gifs')
        .list('', { limit: 1 });
      
      if (storageError) {
        console.log('⚠️ Storage access error (bucket may not exist):', storageError);
        return NextResponse.json({
          success: true,
          connection: 'database_ok',
          storage: 'bucket_not_found',
          message: 'Database connection works, but storage bucket "gifs" does not exist. Please create it manually in Supabase dashboard.'
        });
      }
      
      console.log('✅ Storage access successful');
      return NextResponse.json({
        success: true,
        connection: 'database_ok',
        storage: 'accessible',
        files: storageData?.length || 0
      });
      
    } catch (storageError) {
      console.log('❌ Storage test error:', storageError);
      return NextResponse.json({
        success: true,
        connection: 'database_ok',
        storage: 'error',
        error: storageError instanceof Error ? storageError.message : 'Unknown storage error'
      });
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 