require('dotenv').config({ path: '.env.local' });

console.log('Testing Lighthouse Storage IPFS API...');
console.log('API Key:', process.env.LIGHTHOUSE_API_KEY ? 'Set' : 'Not set');

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY || 'a7ed4f0a.5df477d33a9a4ef9af5228feedfd4d26';
const LIGHTHOUSE_BASE_URL = 'https://api.lighthouse.storage/api/v0';

async function testConnection() {
  try {
    console.log('Testing file upload with Lighthouse Storage API...');
    
    // Test with a simple text file
    const testContent = 'Hello IPFS!';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    
    // Create FormData for upload
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', testBlob, 'test.txt');
    
    // Upload to Lighthouse Storage
    const response = await fetch(`${LIGHTHOUSE_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LIGHTHOUSE_API_KEY}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ File upload successful!');
    console.log('Upload result:', JSON.stringify(result, null, 2));
    console.log('IPFS URL:', `https://ipfs.io/ipfs/${result.Hash}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testConnection(); 