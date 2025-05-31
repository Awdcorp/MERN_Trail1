const express = require("express");

const {
  createNewOrder,
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  adminRefundOrder,
  exportOrdersAsCSV,
} = require("../../controllers/admin/order-controller");

const router = express.Router();
router.post("/create", createNewOrder);
router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);
router.post("/refund", adminRefundOrder);
router.get("/export", exportOrdersAsCSV);
module.exports = router;
