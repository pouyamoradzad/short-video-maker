/**
 * Mixed Language Video Example
 * 
 * This example demonstrates creating a video with both English and Persian text.
 * The system will automatically detect the language and use appropriate TTS.
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3123';

async function createMixedLanguageVideo() {
  try {
    console.log('Creating mixed language short video...');
    
    const response = await axios.post(`${API_BASE_URL}/api/short-video`, {
      scenes: [
        {
          text: "Welcome to our channel! Today we'll talk about technology.",
          searchTerms: ["technology", "computer", "innovation"],
          // No language specified - will be auto-detected as English
        },
        {
          text: "در ادامه، درباره هوش مصنوعی صحبت خواهیم کرد.",
          searchTerms: ["هوش مصنوعی", "آینده", "تکنولوژی"],
          // No language specified - will be auto-detected as Persian
        },
        {
          text: "AI will revolutionize many industries in the coming years.",
          searchTerms: ["artificial intelligence", "future", "business"],
          // No language specified - will be auto-detected as English
        }
      ],
      config: {
        paddingBack: 1500,
        music: "hopeful",
        captionPosition: "bottom",
        captionBackgroundColor: "green",
        voice: "af_heart",
        orientation: "landscape",
        musicVolume: "high"
      }
    });

    const videoId = response.data.videoId;
    console.log(`Mixed language video created with ID: ${videoId}`);
    
    // Poll for completion
    await pollVideoStatus(videoId);
    
    // Download the video
    await downloadVideo(videoId);
    
  } catch (error) {
    console.error('Error creating mixed language video:', error.response?.data || error.message);
  }
}

async function pollVideoStatus(videoId) {
  console.log('Waiting for video to be processed...');
  
  while (true) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/short-video/${videoId}/status`);
      const status = response.data.status;
      
      console.log(`Video status: ${status}`);
      
      if (status === 'ready') {
        console.log('Video is ready!');
        break;
      } else if (status === 'failed') {
        throw new Error('Video processing failed');
      }
      
      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error('Error checking video status:', error.message);
      throw error;
    }
  }
}

async function downloadVideo(videoId) {
  try {
    console.log('Downloading video...');
    
    const response = await axios.get(`${API_BASE_URL}/api/short-video/${videoId}`, {
      responseType: 'stream'
    });
    
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, `mixed-language-video-${videoId}.mp4`);
    const writer = fs.createWriteStream(outputPath);
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Video saved to: ${outputPath}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading video:', error.message);
    throw error;
  }
}

// Run the example
if (require.main === module) {
  createMixedLanguageVideo().catch(console.error);
}

module.exports = { createMixedLanguageVideo };