// scripts/fetch-order.js

const axios = require("axios");

// 🔁 Replace these values:
const API_BASE_URL = "http://localhost:5000"; // Your backend server
const ORDER_ID = "6808f04202ec5152891a75c6"; // MongoDB _id of the order

async function fetchOrderById() {
  try {
    const url = `${API_BASE_URL}/api/orders/${ORDER_ID}`;
    console.log("🔍 Requesting order from:", url);

    const response = await axios.get(url);

    if (response.data.success) {
      console.log("✅ Order fetched successfully:");
      console.dir(response.data.data, { depth: null });
    } else {
      console.warn("⚠️ Order fetch failed:", response.data.message);
    }
  } catch (err) {
    console.error("❌ Error fetching order:");
    console.error(err.response?.data || err.message);
  }
}

fetchOrderById();
