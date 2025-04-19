require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const WOO_API_KEY = process.env.WOO_API_KEY;
const WOO_API_SECRET = process.env.WOO_API_SECRET;
const MONGO_URL = process.env.MONGO_URL;

const WOO_API_BASE = "https://partyworld.ae/wp-json/wc/v3/orders";

if (!WOO_API_KEY || !WOO_API_SECRET || !MONGO_URL) {
  console.error("❌ Missing environment variables. Check your .env file.");
  process.exit(1);
}

async function fetchWooOrders() {
  try {
    const res = await axios.get(WOO_API_BASE, {
      auth: {
        username: WOO_API_KEY,
        password: WOO_API_SECRET,
      },
      params: {
        per_page: 50,
        orderby: "date",
        order: "desc",
      },
    });

    console.log("📦 Sample Woo Order:", res.data[0]);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch WooCommerce orders:");
    console.error(err.response?.data || err.message);
    process.exit(1);
  }
}

async function importWooOrders() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const wooOrders = await fetchWooOrders();

    for (const woo of wooOrders) {
      const exists = await Order.findOne({ wc_order_id: woo.id });
      if (exists) {
        console.log(`🔁 Skipping existing order: ${woo.id}`);
        continue;
      }

      const newOrder = new Order({
        wc_order_id: woo.id,
        customer_name: `${woo.billing.first_name} ${woo.billing.last_name}`.trim(),
        order_status: woo.status,
        paymentMethod: woo.payment_method_title,
        paymentStatus: woo.status === "completed" ? "paid" : "pending",
        totalAmount: parseFloat(woo.total),
        orderDate: new Date(woo.date_created),
        addressInfo: {
          address: woo.billing.address_1,
          city: woo.billing.city,
          phone: woo.billing.phone,
          notes: woo.customer_note,
        },
        cartItems: woo.line_items.map((item) => ({
          productId: item.product_id.toString(),
          title: item.name,
          price: item.total,
          quantity: item.quantity,
        })),
      });

      await newOrder.save();
      console.log(`✅ Imported order #${woo.id} (${newOrder.customer_name})`);
    }

    console.log("🎉 All new WooCommerce orders imported successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error in importWooOrders():", err);
    process.exit(1);
  }
}

importWooOrders();
