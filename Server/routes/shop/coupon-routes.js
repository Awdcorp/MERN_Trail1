const express = require("express");
const router = express.Router();
const { validateCouponCode } = require("../../controllers/shop/coupon-controller");

router.post("/validate", validateCouponCode); // ✅ POST /api/coupons/validate

module.exports = router;
