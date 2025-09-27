/**
 * Persian Video Generation Example
 * 
 * This example demonstrates how to create short videos with Persian text
 * using the short-video-maker API.
 * 
 * Prerequisites:
 * 1. Set OPENAI_API_KEY environment variable for Persian TTS
 * 2. Set PEXELS_API_KEY environment variable for background videos
 * 3. Run the server: npm start
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3123';

async function createPersianVideo() {
  try {
    console.log('Creating Persian short video...');
    
    const response = await axios.post(`${API_BASE_URL}/api/short-video`, {
      scenes: [
        {
          text: "سلام! امروز می‌خواهم درباره تکنولوژی صحبت کنم. تکنولوژی زندگی ما را تغییر داده است.",
          searchTerms: ["تکنولوژی", "کامپیوتر", "موبایل"],
          language: "fa" // Explicitly specify Persian language
        },
        {
          text: "در آینده، هوش مصنوعی نقش مهمی در زندگی ما خواهد داشت.",
          searchTerms: ["هوش مصنوعی", "آینده", "ربات"],
          language: "fa"
        }
      ],
      config: {
        paddingBack: 2000,
        music: "chill",
        captionPosition: "center",
        captionBackgroundColor: "blue",
        voice: "af_heart",
        orientation: "portrait",
        musicVolume: "medium"
      }
    });

    const videoId = response.data.videoId;
    console.log(`Video created with ID: ${videoId}`);
    
    // Poll for completion
    await pollVideoStatus(videoId);
    
    // Download the video
    await downloadVideo(videoId);
    
  } catch (error) {
    console.error('Error creating Persian video:', error.response?.data || error.message);
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
    
    const outputPath = path.join(__dirname, `persian-video-${videoId}.mp4`);
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
  createPersianVideo().catch(console.error);
}

module.exports = { createPersianVideo };