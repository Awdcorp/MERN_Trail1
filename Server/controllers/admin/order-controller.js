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

    const formatted = orders.map((order) => ({
      _id: order._id,
      wc_order_id: order.wc_order_id,
      customer_name: order.customer_name,
      cartItems: order.cartItems,
      addressInfo: order.addressInfo,
      order_status: order.order_status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
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
      data: {
        _id: order._id,
        wc_order_id: order.wc_order_id,
        customer_name: order.customer_name,
        cartItems: order.cartItems,
        addressInfo: order.addressInfo,
        order_status: order.order_status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        orderDate: order.orderDate,
      },
    });
  } catch (e) {
    console.log("❌ Error in getOrderDetailsForAdmin:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentMethod, paymentStatus } = req.body;

    // Build only the fields that are provided
    const updateFields = {};
    if (orderStatus) updateFields.order_status = orderStatus;
    if (paymentMethod) updateFields.paymentMethod = paymentMethod;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    console.log("🔄 Updating DB for order:", id, updateFields);

    const updated = await Order.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

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
      message: "Some error occurred!",
    });
  }
};


module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
