const Order = require("../../models/Order");
const { fetchWooCommerceOrders } = require("../../helpers/woocommerce");

/**
 * Fetch all orders for admin
 */
const getAllOrdersForAdmin = async (req, res) => {
  try {
    await Order.deleteMany({}); // ✅ Deletes all old local orders
    console.log("Fetching existing orders from MongoDB...");
    const existingOrders = await Order.find({}).lean();
    console.log(`MongoDB currently has ${existingOrders.length} orders.`);

    if (existingOrders.length > 0) {
      console.log("Returning stored orders to frontend...");
      res.status(200).json({ success: true, data: existingOrders });

      setTimeout(async () => {
        try {
          console.log("Fetching orders from WooCommerce...");
          const wooOrders = await fetchWooCommerceOrders();
          console.log(`WooCommerce API returned ${wooOrders.length} orders.`);

          let newOrders = 0;
          for (let wooOrder of wooOrders) {
            const existingOrder = await Order.findOne({ wc_order_id: wooOrder.id });

            if (!existingOrder) {
              console.log(`Storing new order: ${wooOrder.id}`);
              const newOrder = new Order({
                wc_order_id: wooOrder.id,
                customer_name: `${wooOrder.billing?.first_name || "Unknown"} ${wooOrder.billing?.last_name || ""}`,
                order_date: wooOrder.date_created || new Date().toISOString(),
                order_status: wooOrder.status || "pending",
                total_amount: wooOrder.total ? `$${wooOrder.total}` : "$0.00",
                items: wooOrder.line_items?.map(item => ({
                  product_name: item.name || "Unknown Product",
                  quantity: item.quantity || 1,
                  price: item.price || "0.00",
                })) || [],
              });

              await newOrder.save();
              newOrders++;
            } else {
              console.log(`Updating existing order: ${wooOrder.id}`);
              await Order.updateOne(
                { wc_order_id: wooOrder.id },
                {
                  $set: {
                    order_status: wooOrder.status || existingOrder.order_status,
                    total_amount: wooOrder.total ? `$${wooOrder.total}` : existingOrder.total_amount,
                    order_date: wooOrder.date_created || existingOrder.order_date,
                    items: wooOrder.line_items?.map(item => ({
                      product_name: item.name || "Unknown Product",
                      quantity: item.quantity || 1,
                      price: item.price || "0.00",
                    })) || existingOrder.items,
                  },
                }
              );
            }
          }

          console.log(`Stored ${newOrders} new WooCommerce orders in MongoDB.`);
        } catch (err) {
          console.error("Error fetching orders from WooCommerce:", err);
        }
      }, 1000);
    } else {
      console.log("No existing orders, fetching from WooCommerce...");
      const wooOrders = await fetchWooCommerceOrders();
      console.log(`WooCommerce API returned ${wooOrders.length} orders.`);

      let newOrders = 0;
      for (let wooOrder of wooOrders) {
        console.log(`Storing new order: ${wooOrder.id}`);
        const newOrder = new Order({
          wc_order_id: wooOrder.id,
          customer_name: `${wooOrder.billing?.first_name || "Unknown"} ${wooOrder.billing?.last_name || ""}`,
          order_date: wooOrder.date_created || new Date().toISOString(),
          order_status: wooOrder.status || "pending",
          total_amount: wooOrder.total ? `$${wooOrder.total}` : "$0.00",
          items: wooOrder.line_items?.map(item => ({
            product_name: item.name || "Unknown Product",
            quantity: item.quantity || 1,
            price: item.price || "0.00",
          })) || [],
        });

        await newOrder.save();
        newOrders++;
      }

      console.log(`Fetched and stored ${newOrders} new WooCommerce orders.`);
      res.status(200).json({ success: true, data: await Order.find({}) });
    }
  } catch (error) {
    console.error("Error fetching and storing orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders", data: [] });
  }
};

/**
 * Fetch single order details for admin
 */
const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching details for order: ${id}`);

    // Check if the order exists in MongoDB first
    let order = await Order.findById(id).lean();
    
    if (!order) {
      console.log(`Order ${id} not found in MongoDB. Checking WooCommerce...`);

      // Fetch order from WooCommerce if missing in MongoDB
      const wooOrders = await fetchWooCommerceOrders();
      order = wooOrders.find(o => o.id.toString() === id);

      if (!order) {
        console.log(`Order ${id} not found in WooCommerce either.`);
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Save fetched order into MongoDB for future requests
      const savedOrder = await Order.create(order);
      console.log(`Stored WooCommerce order ${id} into MongoDB.`);
      order = savedOrder.toObject();
    }

    console.log(`Returning order details:`, order);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllOrdersForAdmin, getOrderDetailsForAdmin };
