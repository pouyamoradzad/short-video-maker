#!/usr/bin/env node

/**
 * Test script for Persian language support
 * Run with: node test_persian.js
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3123';

async function testPersianSupport() {
  console.log('🧪 Testing Persian Language Support');
  console.log('=====================================\n');

  try {
    // Test 1: Health check
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Server is running:', healthResponse.data);
    console.log('');

    // Test 2: Create a simple Persian video
    console.log('2. Creating Persian video...');
    const videoResponse = await axios.post(`${API_BASE_URL}/api/short-video`, {
      scenes: [
        {
          text: "سلام! این یک تست فارسی است.",
          searchTerms: ["طبیعت", "کوه"]
        }
      ],
      config: {
        paddingBack: 1000,
        music: "chill",
        language: "fa"
      }
    });

    const videoId = videoResponse.data.videoId;
    console.log(`✅ Video created with ID: ${videoId}`);
    console.log('');

    // Test 3: Check video status
    console.log('3. Monitoring video creation...');
    let attempts = 0;
    const maxAttempts = 30; // 1 minute timeout
    
    while (attempts < maxAttempts) {
      try {
        const statusResponse = await axios.get(`${API_BASE_URL}/api/short-video/${videoId}/status`);
        const status = statusResponse.data.status;
        
        console.log(`   Status: ${status} (attempt ${attempts + 1}/${maxAttempts})`);
        
        if (status === 'ready') {
          console.log('✅ Video is ready!');
          console.log(`   Download URL: ${API_BASE_URL}/api/short-video/${videoId}`);
          break;
        } else if (status === 'failed') {
          console.log('❌ Video creation failed');
          break;
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(`   Error checking status: ${error.message}`);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    if (attempts >= maxAttempts) {
      console.log('⏰ Timeout waiting for video creation');
    }

    console.log('\n🎉 Persian language support test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testPersianSupport();
}

module.exports = { testPersianSupport };