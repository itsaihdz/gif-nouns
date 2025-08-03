require('dotenv').config({ path: '.env.local' });
const lighthouse = require("@lighthouse-web3/sdk");
const { writeFileSync, unlinkSync } = require('fs');
const { join } = require('path');
const { tmpdir } = require('os');

console.log('Testing Lighthouse Storage IPFS API...');
console.log('API Key:', process.env.LIGHTHOUSE_API_KEY ? 'Set' : 'Not set');

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY || 'a7ed4f0a.5df477d33a9a4ef9af5228feedfd4d26';

async function testConnection() {
  let tempFilePath = null;
  
  try {
    console.log('Testing file upload with Lighthouse SDK...');
    
    // Test file upload
    console.log('Testing file upload...');
    
    // Create test file
    const testContent = 'Hello IPFS!';
    const tempPath = join(tmpdir(), 'test.txt');
    writeFileSync(tempPath, testContent);
    tempFilePath = tempPath;
    
    const uploadResponse = await lighthouse.upload(tempPath, LIGHTHOUSE_API_KEY);
    
    console.log('✅ File upload successful!');
    console.log('Upload result:', JSON.stringify(uploadResponse, null, 2));
    console.log('IPFS URL:', `https://ipfs.io/ipfs/${uploadResponse.data.Hash}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        unlinkSync(tempFilePath);
      } catch (error) {
        console.warn('Failed to cleanup temp file:', error);
      }
    }
  }
}

testConnection(); 