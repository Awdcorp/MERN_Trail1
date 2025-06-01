const express = require("express");
const router = express.Router();
const {
  createOrUpdateCoupon,
  getAllCoupons,
  deleteCoupon,
} = require("../../controllers/admin/coupon-controller");

router.get("/", getAllCoupons);         // 🧾 Fetch all coupons
router.post("/", createOrUpdateCoupon); // ➕ Create or ✏️ Update
router.delete("/:id", deleteCoupon);    // 🗑️ Delete by ID

module.exports = router;
