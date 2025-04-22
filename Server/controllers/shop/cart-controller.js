const mongoose = require("mongoose");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, guestId, productId, quantity } = req.body;
    console.log("📩 [Backend] addToCart received:", { userId, guestId, productId, quantity });

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      console.log("📦 Fetching cart for USER:", userId);
      cart = await Cart.findOne({ userId });
    } else if (!userId && guestId) {
      console.log("📦 Fetching cart for GUEST:", guestId);
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      console.log("🆕 Creating new cart...");
      cart = new Cart({
        userId: mongoose.Types.ObjectId.isValid(userId) ? userId : null,
        guestId: guestId || null,
        items: [],
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    console.log("🔍 Found index:", findCurrentProductIndex);

    if (findCurrentProductIndex === -1) {
      console.log("➕ Adding product to cart:", productId);
      cart.items.push({ productId, quantity });
    } else {
      console.log("🔁 Updating quantity for:", productId);
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    console.log("💾 Cart saved with items count:", cart.items.length);

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.log("❌ Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const id = req.params.userId;
    console.log("📥 Fetching cart items for ID:", id);

    let cart;
    if (mongoose.Types.ObjectId.isValid(id)) {
      cart = await Cart.findOne({ userId: id }).populate({ path: "items.productId", select: "images title price salePrice" });
    } else {
      cart = await Cart.findOne({ guestId: id }).populate({ path: "items.productId", select: "images title price salePrice" });
    }

    if (!cart) {
      console.warn("⚠️ No cart found for ID:", id);
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    console.log("📦 Cart fetched with", cart.items.length, "items");

    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
      console.log("🧹 Cleaned up invalid items, saved again");
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.images?.[0] || null,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...cart._doc, items: populateCartItems } });
  } catch (error) {
    console.log("❌ Error in fetchCartItems:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, guestId, productId, quantity } = req.body;
    console.log("✏️ Update cart qty:", { userId, guestId, productId, quantity });

    let cart;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      cart = await Cart.findOne({ userId });
    } else if (!userId && guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      console.warn("⚠️ No cart found");
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    console.log("📌 Found item at index:", findCurrentProductIndex);

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({ success: false, message: "Cart item not present!" });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({ path: "items.productId", select: "images title price salePrice" });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId?._id || null,
      image: item.productId?.images?.[0] || null,
      title: item.productId?.title || "Product not found",
      price: item.productId?.price || null,
      salePrice: item.productId?.salePrice || null,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...cart._doc, items: populateCartItems } });
  } catch (error) {
    console.log("❌ Error in updateCartItemQty:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, guestId } = req.query;
    const { productId } = req.params;

    console.log("🧨 Incoming DELETE:", { productId, userId, guestId });

    let cart = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      cart = await Cart.findOne({ userId });
    }
    if (!cart && guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      console.warn("❌ No cart found for provided IDs.");
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const beforeCount = cart.items.length;
    cart.items = cart.items.filter((item) => {
      const id = typeof item.productId === "object"
        ? item.productId._id?.toString?.() || item.productId?.toString?.()
        : item.productId?.toString?.();
      return id !== productId;
    });
    const afterCount = cart.items.length;

    console.log(`🗑️ Removed item. Before: ${beforeCount}, After: ${afterCount}`);

    await cart.save();
    await cart.populate({ path: "items.productId", select: "images title price salePrice" });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId?._id || null,
      image: item.productId?.images?.[0] || null,
      title: item.productId?.title || "Product not found",
      price: item.productId?.price || null,
      salePrice: item.productId?.salePrice || null,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...cart._doc, items: populateCartItems } });
  } catch (error) {
    console.log("❌ DELETE error:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const migrateGuestCartToUser = async (req, res) => {
  try {
    const { guestId, userId } = req.body;
    console.log("🚀 Migrating guest cart to user cart", { guestId, userId });

    const guestCart = await Cart.findOne({ guestId });
    if (!guestCart || guestCart.items.length === 0) {
      console.warn("❌ Guest cart empty or missing");
      return res.status(404).json({ success: false, message: "No guest cart found" });
    }
    console.log("📦 Guest cart items:", guestCart.items.length);

    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      userCart = new Cart({ userId, items: [] });
      console.log("🆕 Created user cart");
    }

    for (let guestItem of guestCart.items) {
      const existingIndex = userCart.items.findIndex(
        (item) => item.productId.toString() === guestItem.productId.toString()
      );

      console.log("🔁 Checking:", guestItem.productId.toString(), "→ Found index:", existingIndex);

      if (existingIndex === -1) {
        console.log("➕ Adding item:", guestItem.productId.toString());
        userCart.items.push(guestItem);
      } else {
        console.log("🧮 Merging quantities for:", guestItem.productId.toString());
        userCart.items[existingIndex].quantity += guestItem.quantity;
      }
    }

    await userCart.save();
    console.log("✅ User cart saved. Total items:", userCart.items.length);

    await Cart.deleteOne({ guestId });
    console.log("🧹 Deleted guest cart for:", guestId);

    return res.status(200).json({ success: true, message: "Guest cart migrated to user cart" });
  } catch (err) {
    console.log("❌ Migration error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
  migrateGuestCartToUser,
};
