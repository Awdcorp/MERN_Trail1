const Coupon = require("../../models/coupon-model");

const validateCouponCode = async (req, res) => {
  try {
    const { code, amount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) {
      return res.json({ success: false, message: "Coupon not found" });
    }

    if (!coupon.isActive) {
      return res.json({ success: false, message: "Coupon is not active" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.json({ success: false, message: "Coupon has expired" });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.json({ success: false, message: "Coupon usage limit reached" });
    }

    if (amount < (coupon.minOrderAmount || 0)) {
      return res.json({
        success: false,
        message: `Minimum order amount not met (₹${coupon.minOrderAmount})`,
      });
    }

    return res.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        maxDiscount: coupon.maxDiscount,
      },
    });
  } catch (err) {
    console.error("[❌ Coupon Validation Error]", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  validateCouponCode,
};
