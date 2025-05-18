require("dotenv").config();
const mongoose = require("mongoose");
const dummyOrders = require("./dummyOrdersData"); // ✅ import your data file

// ✅ Define your schema exactly like your original Order.js
const OrderSchema = new mongoose.Schema({
  wc_order_id: { type: Number, unique: true, required: true },
  customer_name: String,
  userId: String,
  guestId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  order_status: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
});

const Order = mongoose.model("Order", OrderSchema);

async function insertDummyOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    for (const order of dummyOrders) {
      const exists = await Order.findOne({ wc_order_id: order.wc_order_id });
      if (exists) {
        console.log(`🔁 Skipping existing order: ${order.wc_order_id}`);
        continue;
      }

      await Order.create(order);
      console.log(`✅ Inserted order: ${order.wc_order_id}`);
    }

    console.log("🎉 All dummy orders inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting orders:", err);
    process.exit(1);
  }
}

insertDummyOrders();
