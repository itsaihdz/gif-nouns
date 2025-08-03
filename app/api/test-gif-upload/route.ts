import { NextRequest, NextResponse } from "next/server";
import { uploadGifToIPFS, uploadMetadataToIPFS } from "../../../lib/ipfs";

export async function GET() {
  try {
    console.log('Testing GIF upload to IPFS...');

    // Create a simple test GIF (1x1 pixel, animated)
    const gifData = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, // GIF89a header
      0x01, 0x00, 0x01, 0x00, // 1x1 image
      0x80, 0x00, 0x00, // Color table
      0xff, 0xff, 0xff, 0x00, 0x00, 0x00, // Colors (white, black)
      0x21, 0xf9, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, // Graphics control extension
      0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, // Image descriptor
      0x02, 0x02, 0x44, 0x01, 0x00, // Image data
      0x3b // GIF trailer
    ]);

    // Convert to Blob
    const gifBlob = new Blob([gifData], { type: 'image/gif' });
    
    console.log('Created test GIF blob:', {
      size: gifBlob.size,
      type: gifBlob.type
    });

    // Upload to IPFS
    const ipfsResult = await uploadGifToIPFS(gifBlob, 'test-animated.gif');
    
    console.log('GIF uploaded to IPFS:', ipfsResult);

    // Create metadata
    const metadata = {
      name: "Test Animated GIF",
      description: "A test animated GIF uploaded to IPFS",
      image: ipfsResult.url,
      attributes: [
        { trait_type: "Type", value: "Animated GIF" },
        { trait_type: "Size", value: `${ipfsResult.size} bytes` },
        { trait_type: "IPFS Hash", value: ipfsResult.hash }
      ],
      created_at: new Date().toISOString()
    };

    // Upload metadata to IPFS
    const metadataResult = await uploadMetadataToIPFS(metadata, 'test-metadata.json');
    
    console.log('Metadata uploaded to IPFS:', metadataResult);

    return NextResponse.json({
      success: true,
      message: "GIF and metadata successfully uploaded to IPFS",
      gif: {
        hash: ipfsResult.hash,
        url: ipfsResult.url,
        size: ipfsResult.size
      },
      metadata: {
        hash: metadataResult.hash,
        url: metadataResult.url,
        size: metadataResult.size
      },
      testData: {
        gifBlobSize: gifBlob.size,
        gifBlobType: gifBlob.type
      }
    });

  } catch (error) {
    console.error('Error testing GIF upload:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
} 