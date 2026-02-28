require("dotenv").config();
const axios = require("axios");

async function testBlackbox() {
  try {
    console.log("Testing Blackbox API...");

    const response = await axios.post(
      "https://api.blackbox.ai/v1/chat",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: "Say 'Blackbox API is working!'" }],
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.BLACKBOX_API_KEY}`
        }
      }
    );

    console.log("✅ API Success!");
    console.log("Response:", response.data);
  } catch (err) {
    console.error("❌ API Error:");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data || err.message);
  }
}

testBlackbox();