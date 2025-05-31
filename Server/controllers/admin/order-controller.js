const { Parser } = require('json2csv');
const Order = require("../../models/Order");

const exportOrdersAsCSV = async (req, res) => {
  try {
    const orders = await Order.find({}).lean();

    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders to export" });
    }

    const fields = [
      { label: 'Order ID', value: '_id' },
      { label: 'Woo ID', value: 'wc_order_id' },
      { label: 'Customer Name', value: 'customer_name' },
      { label: 'Order Status', value: 'order_status' },
      { label: 'Payment Method', value: 'paymentMethod' },
      { label: 'Payment Status', value: 'paymentStatus' },
      { label: 'Total', value: 'totalAmount' },
      { label: 'Date', value: row => row.orderDate?.toISOString().split('T')[0] },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(orders);

    res.header("Content-Type", "text/csv");
    res.attachment("orders.csv");
    res.send(csv);
  } catch (error) {
    console.error("❌ CSV export error:", error);
    res.status(500).json({ success: false, message: "Failed to export CSV" });
  }
};

const createNewOrder = async (req, res) => {
  try {
    console.log("📥 Incoming order creation payload:", req.body);

    const {
      customer_name,
      addressInfo,
      cartItems,
      order_status,
      paymentMethod,
      paymentStatus,
    } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.warn("⚠️ Attempt to create order with empty cartItems");
      return res.status(400).json({ success: false, message: "No products in order" });
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.price || 0) * parseInt(item.quantity || 1);
    }, 0);

    const wc_order_id = Date.now();

    const newOrder = new Order({
      wc_order_id,
      customer_name,
      addressInfo,
      cartItems,
      order_status: order_status || "pending",
      paymentMethod: paymentMethod || "Cash on delivery (+AED12)",
      paymentStatus: paymentStatus || "pending",
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      orderDate: new Date(),
    });

    await newOrder.save();

    console.log("✅ Order created:", newOrder);
    console.log("🧾 Final order:", {
      wc_order_id,
      customer_name,
      totalAmount,
      productCount: cartItems.length,
      paymentMethod: newOrder.paymentMethod,
      status: newOrder.order_status
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (err) {
    console.error("❌ Error in createNewOrder:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    console.log("📥 Fetching all orders for admin...");

    const orders = await Order.find({}).sort({ orderDate: -1 }); // ✅ Sort by latest first

    if (!orders.length) {
      console.warn("⚠️ No orders found in admin fetch");
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

    console.log(`📤 Sending ${formatted.length} orders to admin`);
    res.status(200).json({ success: true, data: formatted });
  } catch (e) {
    console.error("❌ Error in getAllOrdersOfAllUsers:", e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📥 Fetching details for order ID:", id);

    const order = await Order.findById(id);
    if (!order) {
      console.warn("⚠️ Order not found for ID:", id);
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    console.log("📤 Order details found:", order._id);
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
    console.error("❌ Error in getOrderDetailsForAdmin:", e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
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
      customer_name,
    } = req.body;

    console.log("📥 Update request for order:", id);
    const updateFields = {};
    if (orderStatus) updateFields.order_status = orderStatus;
    if (paymentMethod) updateFields.paymentMethod = paymentMethod;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (addressInfo && Object.keys(addressInfo).length > 0) updateFields.addressInfo = addressInfo;
    if (typeof customer_name === 'string' && customer_name.trim()) updateFields.customer_name = customer_name;
    if (cartItems) {
      updateFields.cartItems = cartItems;
      const total = cartItems.reduce((sum, item) => {
        return sum + parseFloat(item.price || 0) * parseInt(item.quantity || 1);
      }, 0);
      updateFields.totalAmount = parseFloat(total.toFixed(2));
    }

    console.log("🔧 Updating fields:", updateFields);
    const updated = await Order.findByIdAndUpdate(id, updateFields, { new: true });

    console.log("✅ Order updated:", updated?._id);
    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
      data: updated,
    });
  } catch (e) {
    console.error("❌ Error while updating order status:", e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
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
    order.paymentStatus = "refunded";

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
        ...(restockItems ? [{ time: now, message: "Items marked as restocked" }] : []),
      ],
    };

    await order.save();

    const updated = await Order.findById(orderId);
    console.log("💸 Refund saved successfully for order:", orderId);

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
  createNewOrder,
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  adminRefundOrder,
  exportOrdersAsCSV,
};
