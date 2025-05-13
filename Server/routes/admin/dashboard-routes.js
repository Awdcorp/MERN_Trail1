// File: Server/routes/admin/dashboard-routes.js

const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getSalesChartData,
  getRecentOrders,
} = require("../../controllers/admin/dashboard-controller");

router.get("/dashboard-stats", getDashboardStats);
router.get("/sales-chart", getSalesChartData);
router.get("/recent-orders", getRecentOrders);

module.exports = router;
