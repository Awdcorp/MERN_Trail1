// models/counter.js
const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 90000 },
});

module.exports = mongoose.model("Counter", CounterSchema);
