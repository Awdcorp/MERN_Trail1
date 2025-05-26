// File: Server/controllers/admin/menu-controller.js

const Menu = require("../../models/Menu");
const Settings = require("../../models/Settings");
// GET: /api/admin/menus/:name (e.g., header or footer)
exports.getMenu = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(`[GET MENU] Fetching menu: ${name}`);
    const menu = await Menu.findOne({ name });
    console.log("[GET MENU] Found:", menu);
    res.json(menu || { name, items: [] });
  } catch (err) {
    console.error("[GET MENU ERROR]", err);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
};

// POST: /api/admin/menus/:name
exports.saveMenu = async (req, res) => {
  try {
    const { name } = req.params;
    const { items } = req.body;
    console.log(`[SAVE MENU] Saving menu: ${name}`);
    console.log("[SAVE MENU] Items:", JSON.stringify(items, null, 2));

    let menu = await Menu.findOne({ name });
    if (menu) {
      console.log("[SAVE MENU] Existing menu found, updating...");
      menu.items = items;
    } else {
      console.log("[SAVE MENU] Creating new menu...");
      menu = new Menu({ name, items });
    }
    await menu.save();
    console.log("[SAVE MENU] Save successful:", menu);
    res.json({ success: true, menu });
  } catch (err) {
    console.error("[SAVE MENU ERROR]", err);
    res.status(500).json({ error: "Failed to save menu" });
  }
};

exports.getActiveHeaderMenuName = async (req, res) => {
  try {
    const doc = await Settings.findOne();
    const menuName = doc?.activeHeaderMenu || "header";
    console.log("🔍 [GET ACTIVE MENU] Fetched from Settings:", menuName);
    res.json({ name: menuName });
  } catch (err) {
    console.error("❌ [GET ACTIVE MENU] Failed to fetch activeHeaderMenu:", err);
    res.status(500).json({ error: "Failed to get active header menu" });
  }
};

exports.setActiveHeaderMenuName = async (req, res) => {
  const { name } = req.body;
  try {
    console.log("📤 [SET ACTIVE MENU] Requested to set activeHeaderMenu to:", name);
    const doc = await Settings.findOneAndUpdate(
      {},
      { activeHeaderMenu: name },
      { new: true, upsert: true }
    );
    console.log("✅ [SET ACTIVE MENU] Successfully updated. Now activeHeaderMenu is:", doc.activeHeaderMenu);
    res.json({ success: true, name: doc.activeHeaderMenu });
  } catch (err) {
    console.error("❌ [SET ACTIVE MENU] Failed to update activeHeaderMenu:", err);
    res.status(500).json({ error: "Failed to update menu setting" });
  }
};

