/**
 * Comprehensive Persian Language Support Example
 * 
 * This example demonstrates all Persian language features:
 * - Automatic language detection
 * - Persian TTS with OpenAI
 * - RTL caption rendering
 * - Search term translation
 * - Mixed language support
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3123';

// Example 1: Pure Persian video with automatic language detection
async function createPurePersianVideo() {
  console.log('🇮🇷 Creating Pure Persian Video (Auto-detection)');
  console.log('================================================');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/short-video`, {
      scenes: [
        {
          text: "سلام! من یک ربات هوش مصنوعی هستم.",
          searchTerms: ["ربات", "تکنولوژی", "آینده"]
        },
        {
          text: "من می‌توانم ویدیوهای کوتاه زیبا ایجاد کنم.",
          searchTerms: ["ویدیو", "زیبا", "خلاقیت"]
        },
        {
          text: "این تکنولوژی جدید برای همه قابل دسترس است.",
          searchTerms: ["تکنولوژی", "دسترس", "همه"]
        }
      ],
      config: {
        paddingBack: 2000,
        music: "hopeful",
        captionPosition: "center",
        captionBackgroundColor: "blue",
        voice: "af_heart",
        orientation: "portrait",
        musicVolume: "medium"
        // No language specified - will be auto-detected
      }
    });

    console.log(`✅ Video ID: ${response.data.videoId}`);
    return response.data.videoId;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    throw error;
  }
}

// Example 2: Explicit Persian language configuration
async function createExplicitPersianVideo() {
  console.log('\n🇮🇷 Creating Explicit Persian Video');
  console.log('===================================');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/short-video`, {
      scenes: [
        {
          text: "این ویدیو به صورت صریح برای زبان فارسی تنظیم شده است.",
          searchTerms: ["طبیعت", "کوه", "دریا", "آسمان"]
        }
      ],
      config: {
        paddingBack: 1500,
        music: "chill",
        language: "fa", // Explicitly set to Persian
        voice: "af_nova",
        orientation: "landscape"
      }
    });

    console.log(`✅ Video ID: ${response.data.videoId}`);
    return response.data.videoId;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    throw error;
  }
}

// Example 3: Mixed language video (English + Persian)
async function createMixedLanguageVideo() {
  console.log('\n🌍 Creating Mixed Language Video');
  console.log('=================================');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/short-video`, {
      scenes: [
        {
          text: "Hello! Welcome to our multilingual video.",
          searchTerms: ["welcome", "multilingual", "technology"]
        },
        {
          text: "سلام! به ویدیوی چندزبانه ما خوش آمدید.",
          searchTerms: ["خوش آمدید", "چندزبانه", "تکنولوژی"]
        },
        {
          text: "This demonstrates automatic language detection.",
          searchTerms: ["demonstration", "automatic", "detection"]
        },
        {
          text: "این تشخیص خودکار زبان را نشان می‌دهد.",
          searchTerms: ["تشخیص", "خودکار", "زبان"]
        }
      ],
      config: {
        paddingBack: 2000,
        music: "happy",
        captionPosition: "bottom",
        captionBackgroundColor: "green",
        orientation: "portrait"
        // Each scene will be processed in its detected language
      }
    });

    console.log(`✅ Video ID: ${response.data.videoId}`);
    return response.data.videoId;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    throw error;
  }
}

// Example 4: Persian with different voices and styles
async function createPersianStyleVariations() {
  console.log('\n🎨 Creating Persian Style Variations');
  console.log('===================================');
  
  const variations = [
    {
      name: "Hopeful Persian",
      config: {
        text: "امید و آرزوهای ما برای آینده بهتر.",
        searchTerms: ["امید", "آینده", "بهتر"],
        music: "hopeful",
        voice: "af_heart"
      }
    },
    {
      name: "Chill Persian", 
      config: {
        text: "آرامش و صلح در طبیعت زیبا.",
        searchTerms: ["آرامش", "طبیعت", "زیبا"],
        music: "chill",
        voice: "af_nova"
      }
    },
    {
      name: "Excited Persian",
      config: {
        text: "شور و هیجان برای تکنولوژی جدید!",
        searchTerms: ["شور", "تکنولوژی", "جدید"],
        music: "excited", 
        voice: "af_sarah"
      }
    }
  ];

  const videoIds = [];
  
  for (const variation of variations) {
    try {
      console.log(`Creating: ${variation.name}`);
      const response = await axios.post(`${API_BASE_URL}/api/short-video`, {
        scenes: [
          {
            text: variation.config.text,
            searchTerms: variation.config.searchTerms
          }
        ],
        config: {
          paddingBack: 1000,
          music: variation.config.music,
          voice: variation.config.voice,
          language: "fa",
          orientation: "portrait"
        }
      });
      
      videoIds.push({
        name: variation.name,
        id: response.data.videoId
      });
      console.log(`✅ ${variation.name} - ID: ${response.data.videoId}`);
    } catch (error) {
      console.error(`❌ Error creating ${variation.name}:`, error.response?.data || error.message);
    }
  }
  
  return videoIds;
}

// Monitor video creation status
async function monitorVideoStatus(videoId, name = "Video") {
  console.log(`\n📊 Monitoring ${name} (ID: ${videoId})`);
  console.log('=====================================');
  
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    try {
      const statusResponse = await axios.get(`${API_BASE_URL}/api/short-video/${videoId}/status`);
      const status = statusResponse.data.status;
      
      console.log(`   Status: ${status} (${attempts + 1}/${maxAttempts})`);
      
      if (status === 'ready') {
        console.log(`✅ ${name} is ready!`);
        console.log(`   Download: ${API_BASE_URL}/api/short-video/${videoId}`);
        return true;
      } else if (status === 'failed') {
        console.log(`❌ ${name} creation failed`);
        return false;
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log(`   Error: ${error.message}`);
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`⏰ Timeout waiting for ${name}`);
  return false;
}

// Main execution
async function runAllExamples() {
  console.log('🚀 Comprehensive Persian Language Support Examples');
  console.log('==================================================\n');
  
  try {
    // Check server health first
    console.log('🔍 Checking server health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Server is running\n');
    
    // Run all examples
    const purePersianId = await createPurePersianVideo();
    const explicitPersianId = await createExplicitPersianVideo();
    const mixedLanguageId = await createMixedLanguageVideo();
    const styleVariations = await createPersianStyleVariations();
    
    console.log('\n📋 Summary of Created Videos:');
    console.log('=============================');
    console.log(`Pure Persian (Auto): ${purePersianId}`);
    console.log(`Explicit Persian: ${explicitPersianId}`);
    console.log(`Mixed Language: ${mixedLanguageId}`);
    console.log('Style Variations:');
    styleVariations.forEach(v => console.log(`  - ${v.name}: ${v.id}`));
    
    // Monitor a few videos
    console.log('\n⏳ Monitoring video creation...');
    await monitorVideoStatus(purePersianId, "Pure Persian");
    await monitorVideoStatus(explicitPersianId, "Explicit Persian");
    
    console.log('\n🎉 All examples completed successfully!');
    console.log('\n💡 Tips:');
    console.log('- Persian text is automatically detected');
    console.log('- Search terms are translated to English for Pexels');
    console.log('- RTL captions are properly rendered');
    console.log('- OpenAI API key is required for Persian TTS');
    
  } catch (error) {
    console.error('\n❌ Example execution failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  createPurePersianVideo,
  createExplicitPersianVideo,
  createMixedLanguageVideo,
  createPersianStyleVariations,
  monitorVideoStatus,
  runAllExamples
};