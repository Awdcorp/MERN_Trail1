const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occurred",
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const data = req.body;

    const newProduct = new Product({
      title: data.title,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      categories: data.categories,
      brand: data.brand,
      price: data.price,
      salePrice: data.salePrice,
      totalStock: data.totalStock,
      weight: data.weight,
      sku: data.sku,
      tags: data.tags,
      images: Array.isArray(data.images) ? data.images : [],
      variants: data.variants || [],
      attributes: data.attributes || [],
      relatedProductIds: data.relatedProductIds || [],
      upsellProductIds: data.upsellProductIds || [],
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      externalId: data.externalId,
      averageReview: data.averageReview,
      meta: data.meta,
      seo: data.seo || { metaTitle: "", metaDescription: "", focusKeyword: "" },
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (e) {
    console.log("❌ Error adding product:", e);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const category = req.query.category || null;
console.log("📂 CATEGORY FILTER RECEIVED:", category);

    const query = {
      ...(search && { title: { $regex: search, $options: "i" } }),
      ...(category && { categories: { $in: [category] } })
    };
console.log("🔍 Incoming Query Params:", req.query);

    const total = await Product.countDocuments(query);

    const listOfProducts = await Product.find(query)
      .populate("categories", "name")
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("🧨 Admin Product Fetch Request");
    console.log("➡️ Page:", page, "Limit:", limit, "Search:", search, "Sort:", sortBy, sortOrder);

    res.status(200).json({
      success: true,
      data: listOfProducts,
      total,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};


const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    console.log("🖼️ Image received in request:", data.image);
    console.log("📦 Full incoming update payload:", data);

    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    findProduct.title = data.title || findProduct.title;
    findProduct.slug = data.slug || findProduct.slug;
    findProduct.description = data.description || findProduct.description;
    findProduct.shortDescription = data.shortDescription || findProduct.shortDescription;
    findProduct.categories = data.categories || findProduct.categories;
    findProduct.brand = data.brand || findProduct.brand;
    findProduct.price = data.price ?? findProduct.price;
    findProduct.salePrice = data.salePrice ?? findProduct.salePrice;
    findProduct.totalStock = data.totalStock ?? findProduct.totalStock;
    findProduct.weight = data.weight ?? findProduct.weight;
    findProduct.sku = data.sku || findProduct.sku;
    findProduct.tags = data.tags || findProduct.tags;
    findProduct.images = Array.isArray(data.images) ? data.images : findProduct.images;
    findProduct.variants = data.variants || findProduct.variants;
    findProduct.attributes = data.attributes || findProduct.attributes;
    findProduct.relatedProductIds = data.relatedProductIds || findProduct.relatedProductIds;
    findProduct.upsellProductIds = data.upsellProductIds || findProduct.upsellProductIds;
    findProduct.isActive = data.isActive ?? findProduct.isActive;
    findProduct.isFeatured = data.isFeatured ?? findProduct.isFeatured;
    findProduct.externalId = data.externalId || findProduct.externalId;
    findProduct.averageReview = data.averageReview || findProduct.averageReview;
    findProduct.meta = data.meta || findProduct.meta;

    if (data.seo) {
      findProduct.seo = {
        metaTitle: data.seo.metaTitle || findProduct.seo?.metaTitle,
        metaDescription: data.seo.metaDescription || findProduct.seo?.metaDescription,
        focusKeyword: data.seo.focusKeyword || findProduct.seo?.focusKeyword,
      };
    }

    await findProduct.save();
    console.log("✅ Product updated:", findProduct);
    res.status(200).json({ success: true, data: findProduct });
  } catch (e) {
    console.log("❌ Error updating product:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("categories", "name");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
};

// 🔍 New async search controller for products
const searchProducts = async (req, res) => {
  try {
    const query = req.query.query || "";
    const limit = parseInt(req.query.limit) || 25;

    console.log("🔍 Incoming product search query:", query);
    console.log("📦 Applying limit:", limit);

    const matchedProducts = await Product.find({
      title: { $regex: query, $options: "i" },
    })
      .select("_id title price")
      .limit(limit);

    console.log("✅ Matched products:", matchedProducts.length);

    return res.status(200).json({
      success: true,
      data: matchedProducts,
    });
  } catch (error) {
    console.error("❌ searchProducts error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
  getProductById,
  searchProducts,
};
