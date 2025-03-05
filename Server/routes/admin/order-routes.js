const express = require("express");
const router = express.Router();
const { getAllOrdersForAdmin, getOrderDetailsForAdmin } = require("../../controllers/admin/order-controller");

// Route to fetch WooCommerce orders and store in MongoDB
router.get("/get", getAllOrdersForAdmin);
// Fetch single order details
router.get("/details/:id", getOrderDetailsForAdmin);
module.exports = router;
  