const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// === MongoDB Connection ===
const MONGO_URI = "mongodb+srv://awdheshjha0922:n1qdFe2yDJEls7H7@cluster0.01ei4iy.mongodb.net/";
const orderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model("Order", orderSchema);

// === Output log file ===
const logPath = path.join(__dirname, "order-list.txt");
fs.writeFileSync(logPath, "=== ORDER LIST ===\n\n");

function log(message) {
  console.log(message);
  fs.appendFileSync(logPath, message + "\n");
}

async function listOrders() {
  try {
    await mongoose.connect(MONGO_URI);
    log("✅ Connected to MongoDB\n");

    const orders = await Order.find().sort({ createdAt: -1 }); // latest first

    log(`📦 Total Orders: ${orders.length}\n`);

    for (const order of orders) {
      log(`🧾 Order ID: ${order._id}`);
      log(`   WC Order ID: ${order.wc_order_id || "N/A"}`);
      log(`   Customer: ${order.customer_name || "Guest"}`);
      log(`   Status: ${order.status || "N/A"}`);
      log(`   Total: ${order.totalAmount || "N/A"} AED`);
      log(`   Payment: ${order.paymentStatus || "N/A"}`);
      log(`   Items:`);

      for (const item of order.cartItems || []) {
        log(`     - ${item.title} (x${item.quantity})`);
      }

      log("--------------------------------------------------");
    }

    await mongoose.disconnect();
    log("✅ Disconnected from MongoDB");
  } catch (err) {
    log("❌ Error: " + err.message);
  }
}

listOrders();
