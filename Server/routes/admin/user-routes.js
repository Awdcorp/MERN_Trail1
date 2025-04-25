const express = require("express");
const router = express.Router();
const { getAllUsers, deactivateUser, updateUser } = require("../../controllers/admin/user-controller");

// Route: GET /api/admin/users
router.get("/", getAllUsers);
router.delete("/:id", deactivateUser);
router.put("/:id", updateUser);
module.exports = router;
