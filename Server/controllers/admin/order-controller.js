const Order = require("../../models/Order");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});
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
        refund: order.refund || null,
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
    const {
      orderStatus,
      paymentMethod,
      paymentStatus,
      addressInfo,
      cartItems,
      customer_name
    } = req.body;

    const updateFields = {};
    if (orderStatus) updateFields.order_status = orderStatus;
    if (paymentMethod) updateFields.paymentMethod = paymentMethod;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (addressInfo && Object.keys(addressInfo).length > 0) updateFields.addressInfo = addressInfo;
    if (typeof customer_name === 'string' && customer_name.trim()) updateFields.customer_name = customer_name;
    if (cartItems) {
      updateFields.cartItems = cartItems;
      // 🧮 Auto-calculate totalAmount
      const total = cartItems.reduce((sum, item) => {
        return sum + parseFloat(item.price || 0) * parseInt(item.quantity || 1);
      }, 0);
      updateFields.totalAmount = parseFloat(total.toFixed(2));
    }

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

const adminRefundOrder = async (req, res) => {
  try {
    const { orderId, refundAmount, refundReason, restockItems } = req.body;

    console.log("📥 Received refund request:", { orderId, refundAmount, refundReason, restockItems });

    const order = await Order.findById(orderId);
    if (!order) {
      console.warn("⚠️ Refund failed: order not found:", orderId);
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.order_status = "refunded";
    order.paymentStatus = "refunded"; // ✅ Update payment status

    const now = new Date();

    order.refund = {
      amount: refundAmount,
      reason: refundReason,
      restock: restockItems,
      refundedAt: now,
      method: order.paymentMethod,
      refundedBy: "System Admin",
      cardLast4: "9704",
      cardBrand: "Mastercard",
      gateway: "Razorpay",
      gatewayRefundId: "rfnd_sim_834xxx",
      status: "success",
      history: [
        { time: now, message: `Refund of AED ${refundAmount} initiated manually` },
        { time: now, message: `Payment status set to 'refunded'` },
        { time: now, message: `Gateway refund (rfnd_sim_834xxx) marked as success` },
        ...(restockItems ? [{ time: now, message: "Items marked as restocked" }] : [])
      ]
    };

    await order.save();

    const updated = await Order.findById(orderId);

    return res.status(200).json({
      success: true,
      message: "Refund recorded",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Refund error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  adminRefundOrder,
};
