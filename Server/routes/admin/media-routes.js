// File: Server/routes/admin/media-routes.js

const express = require("express");
const router = express.Router();
const {
  getMediaFiles,
  deleteMediaFile,
} = require("../../controllers/admin/media-controller");

router.get("/media", getMediaFiles);
router.delete("/media/*", (req, res) => {
  const public_id = req.params[0]; // access full path
  require("../../controllers/admin/media-controller").deleteMediaFile({ ...req, params: { public_id } }, res);
});


module.exports = router;