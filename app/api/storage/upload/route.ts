import { NextRequest, NextResponse } from 'next/server';
import { uploadGifToStorage } from '../../../../lib/supabase-storage';

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
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const result = await uploadGifToStorage(file, filename);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Storage upload API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Check for specific error types
    if (errorMessage.includes('bucket') && errorMessage.includes('does not exist')) {
      return NextResponse.json({
        success: false,
        error: 'Storage bucket not configured. Please create the "gifs" bucket in your Supabase dashboard.',
        details: errorMessage
      }, { status: 500 });
    }
    
    if (errorMessage.includes('fetch failed')) {
      return NextResponse.json({
        success: false,
        error: 'Network error connecting to Supabase. Please check your internet connection and Supabase configuration.',
        details: errorMessage
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Storage upload failed',
      details: errorMessage
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Supabase Storage upload endpoint',
    usage: 'POST with form data containing "file" and "filename"'
  });
} 