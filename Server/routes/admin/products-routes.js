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
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");
const multer = require("multer");
const uploadCSV = multer({ dest: "uploads/" }); // temp local upload for CSV

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);
router.patch("/bulk-update", bulkUpdateProducts);
router.post("/bulk-delete", bulkDeleteProducts);

// 🆕 CSV Export/Import
router.get("/export", exportProductsToCSV);
router.post("/import", uploadCSV.single("file"), importProductsFromCSV);

router.get("/:id", getProductById);
module.exports = router;
