// Address.js
const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  userId: { type: String }, // Optional: for logged-in users
  guestId: { type: String }, // ✅ Added: for guest users
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String },
  phone: { type: String, required: true },
  notes: { type: String },
});

module.exports = mongoose.model("Address", AddressSchema);
