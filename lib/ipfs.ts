// Vercel-compatible IPFS service using Lighthouse Storage API
// This version avoids Node.js file system operations that don't work in serverless

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY || 'a7ed4f0a.5df477d33a9a4ef9af5228feedfd4d26';
const LIGHTHOUSE_BASE_URL = 'https://api.lighthouse.storage/api/v0';

export interface IPFSUploadResult {
  hash: string;
  url: string;
  size: number;
}

// Convert blob to base64 for API upload
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function uploadGifToIPFS(gifBlob: Blob, filename: string): Promise<IPFSUploadResult> {
  try {
    console.log('Uploading GIF to IPFS via Lighthouse Storage:', filename);

    // Convert blob to base64
    const base64Data = await blobToBase64(gifBlob);
    
    // Upload to Lighthouse Storage using base64
    const response = await fetch(`${LIGHTHOUSE_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LIGHTHOUSE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Data,
        filename: filename
      })
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

    // Create metadata blob and convert to base64
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const base64Data = await blobToBase64(metadataBlob);
    
    // Upload to Lighthouse Storage using base64
    const response = await fetch(`${LIGHTHOUSE_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LIGHTHOUSE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Data,
        filename: filename
      })
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
    const base64Data = await blobToBase64(testBlob);
    
    const response = await fetch(`${LIGHTHOUSE_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LIGHTHOUSE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Data,
        filename: 'test.txt'
      })
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