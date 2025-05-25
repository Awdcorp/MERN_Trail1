const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const csvParser = require("csv-parser");
const ProductImportLog = require("../../models/ProductImportLog");
const ProductExportLog = require("../../models/ProductExportLog");
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
    findProduct.status = data.status || findProduct.status;
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
      .select("_id title price slug")
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

const bulkUpdateProducts = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: "Invalid updates format" });
    }

    for (const { id, updates: fields } of updates) {
      await Product.findByIdAndUpdate(id, { $set: fields });
    }

    console.log("✅ Bulk updates applied:", updates.length);
    res.status(200).json({ success: true, message: "Bulk updates completed" });
  } catch (error) {
    console.error("❌ Bulk update failed:", error);
    res.status(500).json({ success: false, message: "Bulk update failed" });
  }
};



const bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;
  try {
    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Bulk delete failed:", error);
    res.status(500).json({ success: false, message: "Bulk delete failed" });
  }
};

// EXPORT PRODUCTS TO CSV
const exportProductsToCSV = async (req, res) => {
  try {
    console.log("🟢 [EXPORT] Starting product export...");

    const selectedFields = Array.isArray(req.query.fields)
      ? req.query.fields
      : typeof req.query.fields === "string"
        ? [req.query.fields]
        : [];

    console.log("📤 [EXPORT] Fields requested:", selectedFields);

    let products;
    const exportIds = req.query.ids?.split(",") || null;

    if (exportIds?.length) {
      console.log("🔍 [EXPORT] Filtering by IDs:", exportIds);
      products = await Product.find({ _id: { $in: exportIds } })
        .populate("categories", "name")
        .lean();
    } else {
      products = await Product.find({})
        .populate("categories", "name")
        .lean();
    }

    console.log(`🧾 [EXPORT] Exporting ${products.length} products.`);

    const formatted = products.map((p) => {
      const row = {};
      for (const field of selectedFields) {
        if (field === "categories") {
          row.categories = Array.isArray(p.categories)
            ? p.categories.map((c) => c.name).join(", ")
            : "";
        } else if (field === "seo") {
          row.seo = p.seo
            ? `${p.seo.metaTitle || ""} | ${p.seo.metaDescription || ""} | ${p.seo.focusKeyword || ""}`
            : "";
        } else if (field === "meta") {
          row.meta = JSON.stringify(p.meta || {});
        } else if (field in p) {
          row[field] = typeof p[field] === "object" ? JSON.stringify(p[field]) : p[field];
        } else {
          row[field] = "";
        }
      }
      return row;
    });

    const parser = new Parser({ fields: selectedFields });
    const csv = parser.parse(formatted);

    // ✅ Save export log
    await ProductExportLog.create({
      fileName: "products_export.csv",
      selectedFields,
      count: products.length,
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products_export.csv");
    res.status(200).send(csv);

    console.log("✅ [EXPORT] CSV sent and logged successfully.");
  } catch (err) {
    console.error("❌ [EXPORT] Error exporting products:", err);
    res.status(500).json({ success: false, message: "Error exporting products" });
  }
};




// IMPORT PRODUCTS FROM CSV
const importProductsFromCSV = async (req, res) => {
  try {
    console.log("🟢 [IMPORT] Import request received");

    if (!req.file?.path) {
      console.error("❌ [IMPORT] No file uploaded");
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const importedProducts = [];

    const createdProductIds = [];
    const skippedRows = [];
    let skippedCount = 0;
    let importedCount = 0;

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        importedProducts.push(row);
      })
      .on("end", async () => {
        for (const row of importedProducts) {
          const label = row.title || row.slug || "Unnamed Row";

          if (!row.title || !row.price) {
            skippedRows.push(`❌ Missing fields in: ${label}`);
            skippedCount++;
            continue;
          }

          const existing = await Product.findOne({ slug: row.slug });
          if (existing) {
            skippedRows.push(`🔁 Duplicate slug: ${row.slug}`);
            skippedCount++;
            continue;
          }

          const newProduct = new Product({
            title: row.title,
            slug: row.slug,
            price: parseFloat(row.price),
            salePrice: parseFloat(row.salePrice) || null,
            totalStock: parseInt(row.totalStock) || 0,
            brand: row.brand || "",
            isActive: row.isActive === "true",
            isFeatured: row.isFeatured === "true",
            categories: [],
          });

          await newProduct.save();
          createdProductIds.push(newProduct._id);
          importedCount++;
        }

        fs.unlinkSync(filePath);

        // ✅ Save log for history + revert
        const importLog = new ProductImportLog({
          fileName,
          importedCount,
          skippedCount,
          createdProductIds,
        });

        await importLog.save();

        res.status(200).json({
          success: true,
          message: `${importedCount} products imported, ${skippedCount} skipped`,
          importedCount,
          skippedCount,
          skippedRows,
        });
      });
  } catch (err) {
    console.error("❌ [IMPORT] Error importing products:", err);
    res.status(500).json({ success: false, message: "Import failed" });
  }
};

const getImportLogs = async (req, res) => {
  try {
    const logs = await ProductImportLog.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    console.error("❌ [IMPORT LOGS] Failed:", err);
    res.status(500).json({ success: false, message: "Failed to fetch logs" });
  }
};

const getExportLogs = async (req, res) => {
  try {
    const logs = await ProductExportLog.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    console.error("❌ [EXPORT LOGS] Failed:", err);
    res.status(500).json({ success: false, message: "Failed to fetch logs" });
  }
};

const revertImportByLogId = async (req, res) => {
  try {
    const { logId } = req.body;
    if (!logId) return res.status(400).json({ success: false, message: "Missing logId" });

    const log = await ProductImportLog.findById(logId);
    if (!log) return res.status(404).json({ success: false, message: "Import log not found" });

    if (log.reverted) {
      return res.status(400).json({ success: false, message: "Import already reverted" });
    }

    const result = await Product.deleteMany({ _id: { $in: log.createdProductIds } });

    log.reverted = true;
    log.revertedAt = new Date();
    await log.save();

    console.log("🗑️ Reverted import, deleted products:", result.deletedCount);
    return res.status(200).json({ success: true, message: `${result.deletedCount} products deleted` });
  } catch (err) {
    console.error("❌ Failed to revert import:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const previewCSVHeaders = async (req, res) => {
  try {
    console.log("📥 [PREVIEW] Preview CSV request received");

    if (!req.file?.path) {
      console.error("❌ [PREVIEW] No file uploaded");
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const headers = [];
    const sample = [];
    let rowCount = 0;

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("headers", (parsedHeaders) => {
        parsedHeaders.forEach((h) => headers.push(h));
        console.log("📋 [PREVIEW] Detected headers:", headers);
      })
      .on("data", (row) => {
        if (rowCount < 5) {
          sample.push(Object.values(row));
          rowCount++;
        }
      })
      .on("end", () => {
        fs.unlinkSync(filePath);
        console.log(`✅ [PREVIEW] Sampled ${sample.length} rows`);
        return res.status(200).json({
          success: true,
          headers,
          sample,
        });
      });
  } catch (err) {
    console.error("❌ [PREVIEW] Error parsing preview CSV:", err);
    return res.status(500).json({ success: false, message: "Preview failed" });
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
  bulkUpdateProducts,
  bulkDeleteProducts,
  exportProductsToCSV,     // ✅ new
  importProductsFromCSV,
  getImportLogs,
  revertImportByLogId,
  previewCSVHeaders,
  getExportLogs,   // ✅ new
};
