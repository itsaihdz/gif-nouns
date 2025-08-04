import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      gifUrl, 
      metadataUrl, 
      noggleColor, 
      eyeAnimation, 
      creator, 
      gifNumber 
    } = body;

    if (!gifUrl || !metadataUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get collection ID from environment
    const collectionId = process.env.NEXT_PUBLIC_HIGHLIGHT_COLLECTION_ID || 'COLLECTION_ID';

    // Prepare metadata for the collective collection
    const metadata = {
      name: `gifnouns #${gifNumber}`,
      description: `An animated Noun with ${noggleColor} noggle and ${eyeAnimation} eyes. Created with gifnouns.`,
      image: gifUrl,
      animation_url: gifUrl,
      external_url: "https://gifnouns.freezerverse.com",
      attributes: [
        {
          trait_type: "Noggle Color",
          value: noggleColor
        },
        {
          trait_type: "Eye Animation",
          value: eyeAnimation
        },
        {
          trait_type: "Creator",
          value: creator || "anonymous"
        },
        {
          trait_type: "Collection",
          value: "GIF Nouns Collective"
        }
      ],
      properties: {
        files: [
          {
            type: "image/gif",
            uri: gifUrl
          }
        ],
        category: "image"
      }
    };

    // Return the Highlight collective collection URL with metadata
    const highlightUrl = `https://highlight.xyz/collect/${collectionId}?metadata=${encodeURIComponent(metadataUrl)}`;

    return NextResponse.json({
      success: true,
      highlightUrl,
      collectionId,
      metadata
    });

  } catch (error) {
    console.error('Highlight preparation error:', error);
    return NextResponse.json(
      { error: 'Failed to prepare Highlight integration' },
      { status: 500 }
    );
  }
} 