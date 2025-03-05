const axios = require("axios");
require("dotenv").config();

console.log("WooCommerce API URL:", process.env.VITE_WC_API);
const wooCommerceApi = axios.create({
  baseURL: process.env.VITE_WC_API,
  auth: {
    username: process.env.VITE_WC_KEY,
    password: process.env.VITE_WC_SECRET,
  },
});

/**
 * Fetch all WooCommerce orders
 */
const fetchWooCommerceOrders = async () => {
  try {
    console.log("Calling WooCommerce API to fetch orders...");
    const response = await wooCommerceApi.get("/orders", {
      params: {
        per_page: 5, // Adjust as needed
        status: "any", // Fetch all order statuses
      },
    });

    console.log(`WooCommerce API Response (${response.data.length} orders):`, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders from WooCommerce:", error.response?.data || error.message);
    return [];
  }
};

module.exports = { fetchWooCommerceOrders };
