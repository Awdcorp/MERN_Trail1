// File: Server/routes/admin/menu-routes.js

const express = require("express");
const router = express.Router();

const { getMenu, saveMenu, getActiveHeaderMenuName, setActiveHeaderMenuName } = require("../../controllers/admin/menu-controller");

router.get("/menus/:name", getMenu);
router.post("/menus/:name", saveMenu);
router.get("/menus/active-header", getActiveHeaderMenuName);
router.post("/menus/active-header", setActiveHeaderMenuName);
module.exports = router;
