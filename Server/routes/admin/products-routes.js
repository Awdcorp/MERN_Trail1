const express = require("express");
const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
  getProductById,
  bulkUpdateProducts,
  bulkDeleteProducts,
  exportProductsToCSV,
  importProductsFromCSV,
  getImportLogs,
  getExportLogs,           // ✅ make sure this is imported
  revertImportByLogId,
  countProductsForExport,
  previewCSVHeaders,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");
const multer = require("multer");
const uploadCSV = multer({ dest: "uploads/" });

const router = express.Router();

// ⬇️ Static Routes
router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);
router.patch("/bulk-update", bulkUpdateProducts);
router.post("/bulk-delete", bulkDeleteProducts);
router.get("/import-logs", getImportLogs);
router.get("/export-logs", getExportLogs);               // ✅ ADD THIS ABOVE :id
router.post("/import-revert", revertImportByLogId);
router.get("/export/count", countProductsForExport);
router.post("/preview-csv", uploadCSV.single("file"), previewCSVHeaders);
router.get("/export", exportProductsToCSV);
router.post("/import", uploadCSV.single("file"), importProductsFromCSV);

// ⛔️ This must always be last to avoid overriding static paths
router.get("/:id", getProductById);

module.exports = router;
