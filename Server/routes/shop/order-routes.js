const express = require("express");

const {
  createOrder,
  getOrderDetails,
  capturePayment,
  getAllOrdersByUser,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/details/:id", getOrderDetails);
router.get("/getAllOrdersByUser/:userId", getAllOrdersByUser);
module.exports = router;
