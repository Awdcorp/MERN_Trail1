// File: Server/routes/admin/menu-routes.js

const express = require("express");
const router = express.Router();

const {
  getMenu,
  saveMenu,
  getActiveHeaderMenuName,
  setActiveHeaderMenuName,
} = require("../../controllers/admin/menu-controller");

// ✅ Specific static routes must come BEFORE dynamic ones
router.get("/menus/active-header", getActiveHeaderMenuName);
router.post("/menus/active-header", setActiveHeaderMenuName);

// ⚠️ Dynamic routes placed after to prevent override
router.get("/menus/:name", getMenu);
router.post("/menus/:name", saveMenu);

module.exports = router;
