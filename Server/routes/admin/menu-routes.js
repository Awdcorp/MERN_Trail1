// File: Server/routes/admin/menu-routes.js

const express = require("express");
const router = express.Router();

const { getMenu, saveMenu } = require("../../controllers/admin/menu-controller");

router.get("/menus/:name", getMenu);
router.post("/menus/:name", saveMenu);

module.exports = router;
