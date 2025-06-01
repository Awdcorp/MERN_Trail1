const Coupon = require("../../models/coupon-model");

// ✅ [ADMIN] Create or Update Coupon
const createOrUpdateCoupon = async (req, res) => {
  try {
    const { id, ...couponData } = req.body;

    if (id) {
      const updated = await Coupon.findByIdAndUpdate(id, couponData, { new: true });
      console.log(`[🛠️ Coupon Update] ID: ${id} | Data:`, couponData);
      return res.json({ success: true, data: updated });
    } else {
      const newCoupon = await Coupon.create(couponData);
      console.log("[✅ Coupon Created] Code:", newCoupon.code);
      return res.json({ success: true, data: newCoupon });
    }
  } catch (err) {
    console.error("[❌ Coupon Save Error]", err);
    return res.status(500).json({ success: false, message: "Failed to save coupon." });
  }
};

// ✅ [ADMIN] Get All Coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    console.log(`[📦 Coupons Fetched] Count: ${coupons.length}`);
    return res.json({ success: true, data: coupons });
  } catch (err) {
    console.error("[❌ Coupon Fetch Error]", err);
    return res.status(500).json({ success: false, message: "Failed to fetch coupons." });
  }
};

// ✅ [ADMIN] Delete Coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);
    console.log("[🗑️ Coupon Deleted] ID:", id);
    return res.json({ success: true });
  } catch (err) {
    console.error("[❌ Coupon Delete Error]", err);
    return res.status(500).json({ success: false, message: "Failed to delete coupon." });
  }
};

module.exports = {
  createOrUpdateCoupon,
  getAllCoupons,
  deleteCoupon,
};
