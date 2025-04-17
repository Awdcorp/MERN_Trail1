const mongoose = require("mongoose");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, guestId, productId, quantity } = req.body;

    if ((!userId && !guestId) || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Safe lookup without casting error
    let cart;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      cart = await Cart.findOne({ userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      cart = new Cart({
        userId: mongoose.Types.ObjectId.isValid(userId) ? userId : null,
        guestId: guestId || null,
        items: [],
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const id = req.params.userId; // This could be either userId or guestId

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    let cart;

    // ✅ Validate whether it's an ObjectId or guest UUID
    if (mongoose.Types.ObjectId.isValid(id)) {
      cart = await Cart.findOne({ userId: id }).populate({
        path: "items.productId",
        select: "images title price salePrice",
      });
    } else {
      cart = await Cart.findOne({ guestId: id }).populate({
        path: "items.productId",
        select: "images title price salePrice",
      });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.images?.[0] || null,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, guestId, productId, quantity } = req.body;

    if ((!userId && !guestId) || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    let cart;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      cart = await Cart.findOne({ userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId?._id || null,
      image: item.productId?.images?.[0] || null,
      title: item.productId?.title || "Product not found",
      price: item.productId?.price || null,
      salePrice: item.productId?.salePrice || null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, guestId } = req.query;
    const { productId } = req.params;

    console.log("🧨 Incoming DELETE:");
    console.log("   ➤ productId:", productId);
    console.log("   ➤ userId:", userId);
    console.log("   ➤ guestId:", guestId);

    if ((!userId && !guestId) || !productId) {
      console.warn("❌ Invalid DELETE request — missing IDs or productId.");
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    let cart = null;

    // Try user cart
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      cart = await Cart.findOne({ userId });
      if (cart) console.log("✅ Found cart using userId:", userId);
    }

    // Fallback: try guest cart
    if (!cart && guestId) {
      cart = await Cart.findOne({ guestId });
      if (cart) console.log("✅ Found cart using guestId:", guestId);
    }

    // Log all guest carts in DB
    if (!cart) {
      const allCarts = await Cart.find({}).lean();
      console.log("🔎 Existing Guest IDs in DB:");
      allCarts.forEach((c) => console.log("   🛒", c.guestId));
    }

    if (!cart) {
      console.warn("❌ No cart found for provided IDs.");
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const beforeCount = cart.items.length;

    // Filter out the target product
    cart.items = cart.items.filter((item) => {
      const id =
        typeof item.productId === "object"
          ? item.productId._id?.toString?.() || item.productId?.toString?.()
          : item.productId?.toString?.();
      return id !== productId;
    });

    const afterCount = cart.items.length;

    console.log(`🗑️  Cart item removal: before=${beforeCount}, after=${afterCount}`);

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId?._id || null,
      image: item.productId?.images?.[0] || null,
      title: item.productId?.title || "Product not found",
      price: item.productId?.price || null,
      salePrice: item.productId?.salePrice || null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log("❌ DELETE error:", error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};


module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
