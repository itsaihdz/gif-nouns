import { NextRequest, NextResponse } from 'next/server';
import { uploadGifToIPFS, uploadMetadataToIPFS } from '../../../../lib/ipfs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'gif' or 'metadata'
    const filename = formData.get('filename') as string;
    const metadata = formData.get('metadata') as string;

    if (!type || !filename) {
      return NextResponse.json(
        { error: 'Missing required fields: type and filename' },
        { status: 400 }
      );
    }

    if (type === 'gif') {
      if (!file) {
        return NextResponse.json(
          { error: 'File is required for GIF upload' },
          { status: 400 }
        );
      }

      console.log('IPFS upload - File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      if (file.size === 0) {
        return NextResponse.json(
          { error: 'File is empty (0 bytes)' },
          { status: 400 }
        );
      }

      try {
        const result = await uploadGifToIPFS(file, filename);
        console.log('IPFS upload successful:', result);
        return NextResponse.json({
          success: true,
          ...result
        });
      } catch (uploadError) {
        console.error('IPFS upload error:', uploadError);
        return NextResponse.json(
          { error: `IPFS upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    } else if (type === 'metadata') {
      if (!metadata) {
        return NextResponse.json(
          { error: 'Metadata is required for metadata upload' },
          { status: 400 }
        );
      }

      const metadataObj = JSON.parse(metadata);
      const result = await uploadMetadataToIPFS(metadataObj, filename);
      return NextResponse.json({
        success: true,
        ...result
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "gif" or "metadata"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      { error: 'Failed to upload to IPFS' },
      { status: 500 }
    );
  }
} 