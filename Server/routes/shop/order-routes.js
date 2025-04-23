const express = require("express");

const {
  createOrder,
  getOrderDetails,
  capturePayment,
  getAllOrdersByUser,
  migrateGuestOrdersToUser,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/details/:id", getOrderDetails);
router.get("/getAllOrdersByUser/:userId", getAllOrdersByUser);
router.patch("/migrate-guest-orders", migrateGuestOrdersToUser);
module.exports = router;
