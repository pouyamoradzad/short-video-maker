// Persian Language Support Example
// This example demonstrates how to create videos with Persian text

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3123';

async function createPersianVideo() {
  try {
    console.log('Creating Persian video...');
    
    const response = await axios.post(`${API_BASE_URL}/api/short-video`, {
      scenes: [
        {
          text: "سلام! این یک ویدیو فارسی است که با هوش مصنوعی ساخته شده است.",
          searchTerms: ["طبیعت", "کوه", "آسمان"]
        },
        {
          text: "ما می‌توانیم ویدیوهای کوتاه زیبا با متن فارسی ایجاد کنیم.",
          searchTerms: ["شهر", "مردم", "زندگی"]
        },
        {
          text: "این تکنولوژی جدید امکان ایجاد محتوای فارسی را فراهم می‌کند.",
          searchTerms: ["تکنولوژی", "کامپیوتر", "آینده"]
        }
      ],
      config: {
        paddingBack: 2000,
        music: "hopeful",
        captionPosition: "center",
        captionBackgroundColor: "blue",
        voice: "af_heart",
        orientation: "portrait",
        musicVolume: "medium",
        language: "fa"  // Explicitly set language to Persian
      }
    });

    const videoId = response.data.videoId;
    console.log(`Video created with ID: ${videoId}`);
    
    // Check status
    let status = 'processing';
    while (status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await axios.get(`${API_BASE_URL}/api/short-video/${videoId}/status`);
      status = statusResponse.data.status;
      console.log(`Status: ${status}`);
    }
    
    if (status === 'ready') {
      console.log('Video is ready!');
      console.log(`Download URL: ${API_BASE_URL}/api/short-video/${videoId}`);
    } else {
      console.log('Video creation failed');
    }
    
  } catch (error) {
    console.error('Error creating Persian video:', error.response?.data || error.message);
  }
}

// Example with automatic language detection
async function createAutoDetectedPersianVideo() {
  try {
    console.log('Creating auto-detected Persian video...');
    
    const response = await axios.post(`${API_BASE_URL}/api/short-video`, {
      scenes: [
        {
          text: "این متن فارسی است و به صورت خودکار تشخیص داده می‌شود.",
          searchTerms: ["دریا", "اقیانوس", "آب"]
        }
      ],
      config: {
        paddingBack: 1500,
        music: "chill",
        // No language specified - will be auto-detected from text
      }
    });

    const videoId = response.data.videoId;
    console.log(`Auto-detected Persian video created with ID: ${videoId}`);
    
  } catch (error) {
    console.error('Error creating auto-detected Persian video:', error.response?.data || error.message);
  }
}

// Example with mixed language content
async function createMixedLanguageVideo() {
  try {
    console.log('Creating mixed language video...');
    
    const response = await axios.post(`${API_BASE_URL}/api/short-video`, {
      scenes: [
        {
          text: "Hello! This is English text.",
          searchTerms: ["nature", "forest", "trees"]
        },
        {
          text: "سلام! این متن فارسی است.",
          searchTerms: ["شهر", "مردم", "خیابان"]
        }
      ],
      config: {
        paddingBack: 2000,
        music: "happy",
        // Each scene will be processed in its detected language
      }
    });

    const videoId = response.data.videoId;
    console.log(`Mixed language video created with ID: ${videoId}`);
    
  } catch (error) {
    console.error('Error creating mixed language video:', error.response?.data || error.message);
  }
}

// Run examples
if (require.main === module) {
  console.log('Persian Language Support Examples');
  console.log('==================================');
  
  // Uncomment the example you want to run:
  
  // createPersianVideo();
  // createAutoDetectedPersianVideo();
  // createMixedLanguageVideo();
  
  console.log('Uncomment one of the example functions to run it.');
}

module.exports = {
  createPersianVideo,
  createAutoDetectedPersianVideo,
  createMixedLanguageVideo
};