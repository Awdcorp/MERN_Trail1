// [Line 1] Setup
const User = require("../../models/User");

// [Line 4] GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "userName email role isActive");
    console.log("👥 [GET USERS] Total:", users.length, "| Users:", users);
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error("❌ [GET USERS] Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// [Line 35] DELETE /api/admin/users/:id → Deactivate user
const deactivateUser = async (req, res) => {
  const userId = req.params.id;

  console.log("🚫 [DEACTIVATE USER] User ID:", userId);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!updatedUser) {
      console.warn("⚠️ [DEACTIVATE USER] User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("✅ [DEACTIVATE USER] Deactivated:", updatedUser);
    res.status(200).json({ success: true, message: "User deactivated" });
  } catch (err) {
    console.error("❌ [DEACTIVATE USER] Error:", err);
    res.status(500).json({ success: false, message: "Failed to deactivate user" });
  }
};

// [Line 55] PUT /api/admin/users/:id → Update role or reactivate
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { role, isActive } = req.body;

  console.log("🔄 [UPDATE USER] ID:", userId, "| Role:", role, "| isActive:", isActive);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...(role && { role }), ...(isActive !== undefined && { isActive }) },
      { new: true, fields: "userName email role isActive" }
    );

    if (!updatedUser) {
      console.warn("⚠️ [UPDATE USER] User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("✅ [UPDATE USER] Updated:", updatedUser);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    console.error("❌ [UPDATE USER] Error:", err);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

module.exports = {
  getAllUsers,
  deactivateUser,
  updateUser,
};
