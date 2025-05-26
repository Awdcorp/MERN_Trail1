// File: Server/controllers/admin/menu-controller.js

const Menu = require("../../models/Menu");

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
