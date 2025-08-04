import { NextRequest, NextResponse } from 'next/server';
import { bucketExists, createBucketIfNotExists, listFilesInBucket } from '../../../../lib/supabase-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');
    
    console.log('🧪 Testing Supabase Storage integration...');

    if (test === 'bucket') {
      // Test bucket existence and creation
      const bucketName = 'gifs';
      
      console.log(`🔍 Checking if bucket '${bucketName}' exists...`);
      const exists = await bucketExists(bucketName);
      
      if (!exists) {
        console.log(`🪣 Bucket '${bucketName}' does not exist, creating...`);
        await createBucketIfNotExists(bucketName, true);
      } else {
        console.log(`✅ Bucket '${bucketName}' already exists`);
      }

      // List files in bucket
      console.log(`📋 Listing files in bucket '${bucketName}'...`);
      const files = await listFilesInBucket(bucketName);

      return NextResponse.json({
        success: true,
        bucket: bucketName,
        exists: true,
        files: files,
        message: 'Bucket test completed successfully'
      });
    }

    if (test === 'list') {
      // Test listing files
      const bucketName = 'gifs';
      const files = await listFilesInBucket(bucketName);

      return NextResponse.json({
        success: true,
        bucket: bucketName,
        files: files,
        count: files.length,
        message: 'File listing test completed successfully'
      });
    }

    // Default test - check bucket existence
    const bucketName = 'gifs';
    const exists = await bucketExists(bucketName);

    return NextResponse.json({
      success: true,
      bucket: bucketName,
      exists: exists,
      message: 'Supabase Storage connection test completed',
      availableTests: ['bucket', 'list'],
      usage: {
        bucket: '/api/storage/test?test=bucket',
        list: '/api/storage/test?test=list'
      }
    });

  } catch (error) {
    console.error('❌ Supabase Storage test error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Storage test failed',
        message: 'Supabase Storage test failed'
      },
      { status: 500 }
    );
  }
} 