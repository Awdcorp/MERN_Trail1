// File: Server/controllers/admin/dashboard-controller.js

const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

// GET /api/admin/dashboard-stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ paymentStatus: "paid" });
    console.log("📊 Total Paid Orders:", totalOrders);

    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;
    console.log("💰 Total Sales:", totalSales);

    const totalProducts = await Product.countDocuments();
    console.log("📦 Total Products:", totalProducts);

    const totalUsers = await User.countDocuments();
    console.log("👥 Total Users:", totalUsers);

    res.json({ totalOrders, sales: totalSales, products: totalProducts, users: totalUsers });
  } catch (err) {
    console.error("/dashboard-stats error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

// GET /api/admin/sales-chart
exports.getSalesChartData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12

    const salesData = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$orderDate" },
          amount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = months.map((m) => ({
      month: new Date(currentYear, m - 1).toLocaleString("default", { month: "short" }),
      amount: salesData.find((s) => s._id === m)?.amount || 0,
    }));

    console.log("📈 Yearly Sales Chart Data:", formatted);
    res.json(formatted);
  } catch (err) {
    console.error("/sales-chart error:", err);
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
};

// GET /api/admin/recent-orders?limit=5
exports.getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("_id total status createdAt")
      .populate("userId", "name email");

    const formatted = orders.map((o) => ({
      _id: o._id,
      total: o.total,
      status: o.status,
      customerName: o.userId?.name || null,
    }));

    console.log("📦 Recent Orders:", formatted);
    res.json(formatted);
  } catch (err) {
    console.error("/recent-orders error:", err);
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
};
