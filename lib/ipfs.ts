// Vercel-compatible IPFS service using Lighthouse Storage API
// This version avoids Node.js file system operations that don't work in serverless

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY || 'a7ed4f0a.5df477d33a9a4ef9af5228feedfd4d26';
const LIGHTHOUSE_BASE_URL = 'https://api.lighthouse.storage/api/v0';

export interface IPFSUploadResult {
  hash: string;
  url: string;
  size: number;
}

export async function uploadGifToIPFS(gifBlob: Blob, filename: string): Promise<IPFSUploadResult> {
  try {
    console.log('Uploading GIF to IPFS via Lighthouse Storage:', filename);
    
    // Prepare form data for upload
    const formData = new FormData();
    formData.append('file', new Blob([gifBlob]), filename);
    
    // Upload to Lighthouse Storage
    const response = await fetch(`${LIGHTHOUSE_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LIGHTHOUSE_API_KEY}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const ipfsHash = result.Hash;
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

    // Create metadata blob
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    
    // Prepare form data for upload
    const formData = new FormData();
    formData.append('file', metadataBlob, filename);
    
    // Upload to Lighthouse Storage
    const response = await fetch(`${LIGHTHOUSE_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LIGHTHOUSE_API_KEY}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const ipfsHash = result.Hash;
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
  }
}

export async function testIPFSConnection(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Testing IPFS connection via Lighthouse Storage...');
    
    // Test with a simple text file
    const testContent = 'Hello IPFS!';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', testBlob, 'test.txt');
    
    const response = await fetch(`${LIGHTHOUSE_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LIGHTHOUSE_API_KEY}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Test failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return { 
      success: true, 
      message: `IPFS connection successful. Test file uploaded: ${result.Hash}` 
    };
  } catch (error) {
    console.error('IPFS connection test failed:', error);
    return { 
      success: false, 
      message: `IPFS connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
} 