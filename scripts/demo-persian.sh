#!/bin/bash

# Persian Language Demo for short-video-maker
# This script demonstrates how to create Persian videos using the REST API

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_URL="http://localhost:3123"

echo "🇮🇷 Persian Language Demo for Short Video Maker"
echo "================================================="
echo ""

# Check if server is running
echo "Checking if server is running..."
if ! curl -s "${BASE_URL}/health" > /dev/null; then
    echo "❌ Server is not running. Please start the server first:"
    echo "   docker run -p 3123:3123 -e PEXELS_API_KEY=YOUR_KEY -e OPENAI_API_KEY=YOUR_KEY gyoridavid/short-video-maker:latest"
    echo "   or"
    echo "   npm start"
    exit 1
fi
echo "✅ Server is running"
echo ""

# Create Persian video 1: Nature Theme
echo "Creating Persian nature video..."
RESPONSE1=$(curl -s -X POST "${BASE_URL}/api/short-video" \
  -H "Content-Type: application/json" \
  -d '{
    "scenes": [
      {
        "text": "طبیعت زیبا و آرامش بخش است",
        "searchTerms": ["طبیعت", "آرامش", "زیبایی"]
      },
      {
        "text": "درختان سبز و آسمان آبی",
        "searchTerms": ["درخت", "آسمان", "سبز"]
      },
      {
        "text": "پرندگان در آزادی پرواز می‌کنند",
        "searchTerms": ["پرنده", "پرواز", "آزادی"]
      }
    ],
    "config": {
      "language": "fa",
      "ttsEngine": "openai",
      "paddingBack": 2000,
      "music": "chill",
      "captionPosition": "bottom",
      "orientation": "portrait"
    }
  }')

VIDEO_ID1=$(echo "$RESPONSE1" | grep -o '"videoId":"[^"]*"' | cut -d'"' -f4)
echo "✅ Persian nature video queued with ID: $VIDEO_ID1"

# Create Persian video 2: Technology Theme
echo "Creating Persian technology video..."
RESPONSE2=$(curl -s -X POST "${BASE_URL}/api/short-video" \
  -H "Content-Type: application/json" \
  -d '{
    "scenes": [
      {
        "text": "فناوری زندگی ما را تغییر داده است",
        "searchTerms": ["فناوری", "کامپیوتر", "تکنولوژی"]
      },
      {
        "text": "هوش مصنوعی آینده را می‌سازد",
        "searchTerms": ["هوش مصنوعی", "آینده", "ربات"]
      }
    ],
    "config": {
      "language": "fa",
      "ttsEngine": "openai",
      "paddingBack": 1500,
      "music": "excited",
      "captionPosition": "center",
      "orientation": "landscape"
    }
  }')

VIDEO_ID2=$(echo "$RESPONSE2" | grep -o '"videoId":"[^"]*"' | cut -d'"' -f4)
echo "✅ Persian technology video queued with ID: $VIDEO_ID2"

echo ""
echo "📹 Videos are being processed..."
echo "You can check the status using:"
echo "   curl ${BASE_URL}/api/short-video/${VIDEO_ID1}/status"
echo "   curl ${BASE_URL}/api/short-video/${VIDEO_ID2}/status"
echo ""
echo "Once ready, download the videos:"
echo "   curl ${BASE_URL}/api/short-video/${VIDEO_ID1} -o persian-nature.mp4"
echo "   curl ${BASE_URL}/api/short-video/${VIDEO_ID2} -o persian-tech.mp4"
echo ""
echo "🎉 Persian video demo completed!"
echo ""
echo "Features demonstrated:"
echo "  ✅ Persian TTS with OpenAI"
echo "  ✅ Automatic Persian text detection"
echo "  ✅ Persian-to-English search term translation"
echo "  ✅ RTL caption rendering"
echo "  ✅ Persian-compatible fonts"
echo "  ✅ Both portrait and landscape orientations"