const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const getNextOrderId = require("../../helpers/getNextOrderId");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // ✅ Validate & calculate accurate total from cartItems
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const calculatedTotal = cartItems.reduce((sum, item) => {
      if (!item.price || !item.quantity || !item.title) {
        throw new Error("Missing price/quantity/title in cartItems");
      }
      return sum + item.price * item.quantity;
    }, 0).toFixed(2);

    const wc_order_id = await getNextOrderId();

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: calculatedTotal,
          },
          description: "Purchase from PartyWorld",
        },
      ],
    };

    console.log("🧾 PayPal Payload:", JSON.stringify(create_payment_json, null, 2));

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("❌ PayPal Error:", error.response || error);

        return res.status(400).json({
          success: false,
          message: "PayPal VALIDATION_ERROR",
          details: error?.response?.details || [],
        });
      } else {
        const newlyCreatedOrder = new Order({
          wc_order_id,
          userId,
          guestId: req.body.guestId || null, // ✅ NEW LINE
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount: parseFloat(calculatedTotal),
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });        

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        return res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });

  } catch (e) {
    console.error("❌ createOrder internal error:", e);
    return res.status(500).json({
      success: false,
      message: "Server error during order creation",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    if (!paymentId || !payerId || !orderId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already captured",
        orderId: order._id,
      });
    }

    paypal.payment.execute(paymentId, { payer_id: payerId }, async (error, paymentInfo) => {
      if (error) {
        console.error("❌ PayPal execute failed:", error.response || error);
        return res.status(400).json({
          success: false,
          message: "Failed to capture PayPal payment",
          details: error.response?.details || [],
        });
      }

      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
      order.payerId = payerId;

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment captured successfully",
        orderId: order._id,
      });
    });
  } catch (err) {
    console.error("❌ capturePayment server error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
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
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
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

const migrateGuestOrdersToUser = async (req, res) => {
  try {
    const { guestId, userId } = req.body;

    console.log("🛠️ Received request to migrate orders:");
    console.log("➡️ guestId:", guestId);
    console.log("➡️ userId:", userId);

    if (!guestId || !userId) {
      console.warn("⚠️ Missing guestId or userId in request body.");
      return res.status(400).json({
        success: false,
        message: "guestId and userId are required"
      });
    }

    console.log("🔍 Finding orders with guestId:", guestId);
    const ordersToUpdate = await Order.find({ guestId });
    console.log(`📦 Found ${ordersToUpdate.length} guest orders to migrate.`);

    const result = await Order.updateMany(
      { guestId },
      { $set: { userId }, $unset: { guestId: "" } }
    );

    console.log("✅ Migration complete.");
    console.log("🧾 Mongo update result:", result);

    res.status(200).json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error("❌ Error migrating guest orders:", err);
    res.status(500).json({
      success: false,
      message: "Failed to migrate guest orders"
    });
  }
};


module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  migrateGuestOrdersToUser,
};