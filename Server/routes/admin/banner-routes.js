// [Line 1] Import express and controller
const express = require("express");
const {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../../controllers/admin/banner-controller");

// [Line 8] Create router
const router = express.Router();

// [Line 11–14] Route mappings
router.get("/", getAllBanners);
router.post("/", createBanner);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

// [Line 17] Export
module.exports = router;
