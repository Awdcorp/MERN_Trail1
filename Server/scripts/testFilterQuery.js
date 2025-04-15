require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

async function checkCartUserIdTypes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const Cart = mongoose.connection.collection("carts");

    const total = await Cart.estimatedDocumentCount();
    const objectIdCount = await Cart.countDocuments({ userId: { $type: "objectId" } });
    const stringCount = await Cart.countDocuments({ userId: { $type: "string" } });

    console.log(`📦 Total Cart Documents: ${total}`);
    console.log(`🧪 userId as ObjectId: ${objectIdCount}`);
    console.log(`🔤 userId as String: ${stringCount}`);

    const sampleObjId = await Cart.find({ userId: { $type: "objectId" } }).limit(5).toArray();
    const sampleString = await Cart.find({ userId: { $type: "string" } }).limit(5).toArray();

    console.log(`\n🧪 Sample ObjectId userId carts:`);
    sampleObjId.forEach((doc) => console.log(` - _id: ${doc._id}, userId: ${doc.userId}`));

    console.log(`\n🔤 Sample String userId carts:`);
    sampleString.forEach((doc) => console.log(` - _id: ${doc._id}, userId: ${doc.userId}`));

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

checkCartUserIdTypes();
