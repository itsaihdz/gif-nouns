// Vercel-compatible IPFS service using Lighthouse Storage SDK
// Based on https://docs.lighthouse.storage/lighthouse-1

import lighthouse from '@lighthouse-web3/sdk';

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY || 'a7ed4f0a.5df477d33a9a4ef9af5228feedfd4d26';

export interface IPFSUploadResult {
  hash: string;
  url: string;
  size: number;
}

export async function uploadGifToIPFS(gifBlob: Blob, filename: string): Promise<IPFSUploadResult> {
  try {
    console.log('Uploading GIF to IPFS via Lighthouse Storage:', filename);

    // Convert blob to buffer for Lighthouse SDK
    const arrayBuffer = await gifBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload using Lighthouse SDK uploadBuffer method
    const uploadResponse = await lighthouse.uploadBuffer(
      buffer,
      LIGHTHOUSE_API_KEY,
      1 // cidVersion
    );

    if (!uploadResponse.data) {
      throw new Error('Upload failed: No data returned from Lighthouse');
    }

    const ipfsHash = uploadResponse.data.Hash;
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    console.log('GIF uploaded to IPFS:', {
      hash: ipfsHash,
      url: ipfsUrl,
      size: gifBlob.size
    });

    return {
      hash: ipfsHash,
      url: ipfsUrl,
      size: gifBlob.size
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload GIF to IPFS');
  }
}

export async function uploadMetadataToIPFS(metadata: any, filename: string): Promise<IPFSUploadResult> {
  try {
    console.log('Uploading metadata to IPFS via Lighthouse Storage:', filename);

    // Create metadata JSON string and convert to buffer
    const metadataString = JSON.stringify(metadata, null, 2);
    const buffer = Buffer.from(metadataString, 'utf8');
    
    // Upload using Lighthouse SDK uploadBuffer method
    const uploadResponse = await lighthouse.uploadBuffer(
      buffer,
      LIGHTHOUSE_API_KEY,
      1 // cidVersion
    );

    if (!uploadResponse.data) {
      throw new Error('Upload failed: No data returned from Lighthouse');
    }

    const ipfsHash = uploadResponse.data.Hash;
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    console.log('Metadata uploaded to IPFS:', {
      hash: ipfsHash,
      url: ipfsUrl,
      size: buffer.length
    });

    return {
      hash: ipfsHash,
      url: ipfsUrl,
      size: buffer.length
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

export async function testIPFSConnection(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Testing IPFS connection via Lighthouse Storage...');
    
    // Test with a simple text file
    const testContent = 'Hello IPFS!';
    const buffer = Buffer.from(testContent, 'utf8');
    
    const uploadResponse = await lighthouse.uploadBuffer(
      buffer,
      LIGHTHOUSE_API_KEY,
      1 // cidVersion
    );

    if (!uploadResponse.data) {
      throw new Error('Test failed: No data returned from Lighthouse');
    }

    return { 
      success: true, 
      message: `IPFS connection successful. Test file uploaded: ${uploadResponse.data.Hash}` 
    };
  } catch (error) {
    console.error('IPFS connection test failed:', error);
    return { 
      success: false, 
      message: `IPFS connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
} 