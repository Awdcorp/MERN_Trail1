// Server/routes/admin/settings-routes.js

const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../../controllers/admin/settings-controller");

router.get("/", getSettings);
router.put("/", updateSettings);

module.exports = router;
