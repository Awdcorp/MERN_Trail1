// utils/getNextOrderId.js
const Counter = require("../models/counter");

const getNextOrderId = async () => {
  const result = await Counter.findOneAndUpdate(
    { name: "order_id" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
};

module.exports = getNextOrderId;
