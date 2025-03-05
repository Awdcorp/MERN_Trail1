const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  wc_order_id: { type: Number, unique: true, required: true }, // ✅ Ensure it's in the schema
  customer_name: { type: String, required: true },
  order_date: { type: Date, required: true },
  order_status: { type: String, required: true },
  total_amount: { type: String, required: true },
  items: [
    {
      product_name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Order", OrderSchema);
