const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  wc_order_id: Number,                    // ✅ WooCommerce ID
  customer_name: String,                  // ✅ billing.first_name + last_name
  userId: String,                         // for local orders
  cartId: String,                         // for local guest/user carts

  cartItems: [                            // ✅ from line_items
    {
      productId: String,                  // optional (can use Woo product_id)
      title: String,
      image: String,                      // optional, from product.image.src
      price: String,
      quantity: Number,
    },
  ],

  addressInfo: {
    addressId: String,                    // only for internal users
    address: String,                      // ✅ billing.address_1
    city: String,                         // ✅ billing.city
    pincode: String,                      // optional
    phone: String,                        // ✅ billing.phone
    notes: String,                        // ✅ customer_note
  },

  order_status: String,                   // ✅ Woo status (pending, processing, completed...)
  paymentMethod: String,                  // ✅ payment_method_title
  paymentStatus: String,                  // ✅ derived from status ('paid', 'pending')
  totalAmount: Number,                    // ✅ parseFloat(order.total)

  orderDate: Date,                        // ✅ new Date(order.date_created)
  orderUpdateDate: Date,                  // optional (from date_modified)
  paymentId: String,                      // optional
  payerId: String,                        // optional
});

module.exports = mongoose.model("Order", OrderSchema);
