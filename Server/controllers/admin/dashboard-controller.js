// File: Server/controllers/admin/dashboard-controller.js

const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

// GET /api/admin/dashboard-stats
// GET /api/admin/dashboard-stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // Orders by status
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const refundOrders = await Order.countDocuments({ status: "refunded" });

    // Products by status
    const activeProducts = await Product.countDocuments({ isActive: true });
    const draftProducts = await Product.countDocuments({ isActive: false });
    const lowStockProducts = await Product.countDocuments({ totalStock: { $lte: 5 } });

    // Users created in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    // Derived metrics
    const avgOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;
    const refundRate = totalOrders > 0 ? ((refundOrders / totalOrders) * 100).toFixed(2) : 0;

    res.json({
      totalOrders,
      sales: totalSales,
      products: totalProducts,
      users: totalUsers,

      // Order status counts
      pendingOrders,
      completedOrders,
      refundOrders,

      // Product status counts
      activeProducts,
      draftProducts,
      lowStockProducts,

      // User metrics
      newUsersThisWeek,

      // Performance metrics
      avgOrderValue,
      refundRate,
    });
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
      month: new Date(currentYear, m - 1).toLocaleString("en-US", { month: "short" }),
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
      .select("_id customer_name totalAmount paymentStatus createdAt");

    const formatted = orders.map((o) => ({
      _id: o._id,
      total: o.totalAmount,
      status: o.paymentStatus,
      customerName: o.customer_name || "Guest",
    }));

    console.log("📦 Raw Orders Fetched:", orders.length);
    console.log("✅ Mapped Recent Orders:", formatted);

    res.json(formatted);
  } catch (err) {
    console.error("❌ /recent-orders error:", err);
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
};

