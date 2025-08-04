import { NextRequest, NextResponse } from 'next/server';
import { uploadGifToStorage, createBucketIfNotExists } from '../../../../lib/supabase-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!filename) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      );
    }

    console.log('📤 Storage upload request:', {
      filename,
      size: file.size,
      type: file.type
    });

    // Validate file type
    if (file.type !== 'image/gif') {
      return NextResponse.json(
        { error: 'Only GIF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Ensure the gifs bucket exists
    try {
      await createBucketIfNotExists('gifs', true);
    } catch (error) {
      console.warn('⚠️ Could not create bucket, continuing with upload:', error);
    }

    // Upload the file to Supabase Storage
    const result = await uploadGifToStorage(file, filename, 'gifs');

    console.log('✅ Storage upload successful:', result);

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('❌ Storage upload error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Supabase Storage upload endpoint',
    usage: 'POST with form data containing "file" and "filename"'
  });
} 