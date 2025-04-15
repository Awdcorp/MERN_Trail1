const Product = require("../../models/Product");
const mongoose = require("mongoose");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh", limit = 0 } = req.query;

    let filters = {};

    if (category.length) {
      filters.categories = {
        $in: category
          .split(",")
          .filter(id => mongoose.Types.ObjectId.isValid(id))
          .map(id => new mongoose.Types.ObjectId(id)),
      };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const numericLimit = parseInt(limit);

    console.log("🔍 [FILTERED PRODUCTS] Filters applied:", filters);
    console.log("🧭 [FILTERED PRODUCTS] Sort option:", sort);
    console.log("📏 [FILTERED PRODUCTS] Limit applied:", numericLimit > 0 ? numericLimit : "No limit");

    let query = Product.find(filters).sort(sort).populate("categories", "name slug");

    if (numericLimit > 0) {
      query = query.limit(numericLimit);
    }

    const products = await query.exec();

    console.log(`✅ [FILTERED PRODUCTS] Total fetched: ${products.length}`);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.error("❌ [FILTERED PRODUCTS] Error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 [PRODUCT DETAILS] Fetching by ID: ${id}`);
    const product = await Product.findById(id);

    if (!product) {
      console.warn("⚠️ [PRODUCT DETAILS] Product not found!");
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    console.log("✅ [PRODUCT DETAILS] Found product:", product.title);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.error("❌ [PRODUCT DETAILS] Error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
