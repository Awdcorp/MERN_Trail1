const Order = require("../../models/Order");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});
    console.log("📦 Admin getAllOrdersOfAllUsers fetched:", orders);
    if (!orders.length) {
      console.log("⚠️ No orders found in admin fetch");
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log("❌ Error in getAllOrdersOfAllUsers:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    console.log("🔄 Updating DB for order:", id, "=>", orderStatus);
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { order_status: orderStatus },  // ✅ align with frontend and DB
      { new: true }                   // ✅ return updated document
    );
    

    console.log("✅ Updated Order:", updated);
    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
      data: updated,
    });
  } catch (e) {
    console.log("❌ Error while updating order status:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
