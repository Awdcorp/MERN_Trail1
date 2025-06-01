const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/contact-message-controller");

// Public route for form submission
router.post("/contact-message", controller.submitMessage);

// Admin routes (no auth middleware for now)
router.get("/admin/contact-messages", controller.getAllMessages);
router.patch("/admin/contact-messages/:id/read", controller.markAsRead);
router.delete("/admin/contact-messages/:id", controller.deleteMessage);

module.exports = router;
