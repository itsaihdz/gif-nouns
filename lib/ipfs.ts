import lighthouse from "@lighthouse-web3/sdk";
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// Lighthouse Storage IPFS API client
// Free tier: 5GB storage, 5GB bandwidth
// Lite tier: 200GB storage, 100GB bandwidth for $10/month
const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY || 'a7ed4f0a.5df477d33a9a4ef9af5228feedfd4d26';

export interface IPFSUploadResult {
  hash: string;
  url: string;
  size: number;
}

// Helper function to save blob to temporary file
async function saveBlobToTempFile(blob: Blob, filename: string): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const tempPath = join(tmpdir(), filename);
  writeFileSync(tempPath, buffer);
  return tempPath;
}

// Helper function to clean up temporary file
function cleanupTempFile(filePath: string) {
  try {
    unlinkSync(filePath);
  } catch (error) {
    console.warn('Failed to cleanup temp file:', error);
  }
}

export async function uploadGifToIPFS(gifBlob: Blob, filename: string): Promise<IPFSUploadResult> {
  let tempFilePath: string | null = null;
  
  try {
    console.log('Uploading GIF to IPFS via Lighthouse Storage:', filename);

    // Save blob to temporary file
    tempFilePath = await saveBlobToTempFile(gifBlob, filename);
    
    // Upload to IPFS via Lighthouse SDK
    const uploadResponse = await lighthouse.upload(tempFilePath, LIGHTHOUSE_API_KEY);
    
    // Extract IPFS hash from the response
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
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      cleanupTempFile(tempFilePath);
    }
  }
}

export async function uploadMetadataToIPFS(metadata: any, filename: string): Promise<IPFSUploadResult> {
  let tempFilePath: string | null = null;
  
  try {
    console.log('Uploading metadata to IPFS via Lighthouse Storage:', filename);

    // Create metadata blob and save to temporary file
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    tempFilePath = await saveBlobToTempFile(metadataBlob, filename);
    
    // Upload to IPFS via Lighthouse SDK
    const uploadResponse = await lighthouse.upload(tempFilePath, LIGHTHOUSE_API_KEY);
    
    // Extract IPFS hash from the response
    const ipfsHash = uploadResponse.data.Hash;
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    console.log('Metadata uploaded to IPFS:', {
      hash: ipfsHash,
      url: ipfsUrl,
      size: metadataBlob.size
    });

    return {
      hash: ipfsHash,
      url: ipfsUrl,
      size: metadataBlob.size
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      cleanupTempFile(tempFilePath);
    }
  }
}

export async function testIPFSConnection(): Promise<{ success: boolean; message: string }> {
  let tempFilePath: string | null = null;
  
  try {
    console.log('Testing IPFS connection via Lighthouse Storage...');

    // Create test file
    const testContent = 'Hello IPFS!';
    const tempPath = join(tmpdir(), 'test.txt');
    writeFileSync(tempPath, testContent);
    tempFilePath = tempPath;
    
    const uploadResponse = await lighthouse.upload(tempPath, LIGHTHOUSE_API_KEY);
    
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
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      cleanupTempFile(tempFilePath);
    }
  }
} 