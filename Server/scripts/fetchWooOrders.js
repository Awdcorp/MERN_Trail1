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
  const allOrders = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const res = await axios.get(WOO_API_BASE, {
        auth: {
          username: WOO_API_KEY,
          password: WOO_API_SECRET,
        },
        params: {
          per_page: 100,
          page,
          orderby: "date",
          order: "desc",
        },
      });

      if (res.headers["x-wp-totalpages"]) {
        totalPages = parseInt(res.headers["x-wp-totalpages"], 10);
      }

      console.log(`📦 Page ${page}/${totalPages} — Orders fetched: ${res.data.length}`);
      allOrders.push(...res.data);
      page++;
    } while (page <= totalPages);

    return allOrders;
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
      const existingOrder = await Order.findOne({ wc_order_id: woo.id });

      const orderData = {
        customer_name: `${woo.billing.first_name} ${woo.billing.last_name}`.trim(),
        userId: null,
        guestId: null,
        cartId: null,
        cartItems: woo.line_items.map((item) => ({
          productId: item.product_id?.toString(),
          title: item.name,
          image: item.image?.src || "",
          price: item.total,
          quantity: item.quantity,
        })),
        addressInfo: {
          addressId: null,
          address: woo.billing.address_1,
          city: woo.billing.city,
          pincode: woo.billing.postcode,
          phone: woo.billing.phone,
          notes: woo.customer_note,
        },
        order_status: woo.status,
        paymentMethod: woo.payment_method_title,
        paymentStatus: woo.status === "completed" ? "paid" : "pending",
        totalAmount: parseFloat(woo.total),
        orderDate: new Date(woo.date_created),
        orderUpdateDate: new Date(woo.date_modified),
        paymentId: woo.payment_id || null,
        payerId: woo.payer_id || null,
      };

      if (existingOrder) {
        await Order.updateOne({ wc_order_id: woo.id }, orderData);
        console.log(`🔄 Updated existing order: ${woo.id}`);
      } else {
        await new Order({ wc_order_id: woo.id, ...orderData }).save();
        console.log(`✅ Imported new order: ${woo.id}`);
      }
    }

    console.log("🎉 All WooCommerce orders processed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error in importWooOrders():", err);
    process.exit(1);
  }
}

importWooOrders();
