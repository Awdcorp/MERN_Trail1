// Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  wc_order_id: {
    type: Number,
    unique: true,
    required: true,
  },
  customer_name: String,
  userId: String,
  guestId: String,
  cartId: String,

  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],

  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },

  order_status: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
 refund: {
    amount: Number,
    reason: String,
    restock: Boolean,
    refundedAt: Date,
    method: String,
    refundedBy: String,
    cardLast4: String,
    cardBrand: String,
    gateway: String,
    gatewayRefundId: String,
    status: String,
    history: [
      {
        message: String,
        time: Date,
      },
    ],
  },
  coupon: {
  type: Object,
  default: null,
},

  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
});

module.exports = mongoose.model("Order", OrderSchema);
