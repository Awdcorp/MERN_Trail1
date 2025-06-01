const ContactMessage = require("../../models/ContactMessage");
const Settings = require("../../models/Settings");
const nodemailer = require("nodemailer");

// helper for email
const sendNotificationEmail = async ({ to, subject, html }) => {
  if (!to) return;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
};

// Submit contact form
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMsg = new ContactMessage({ name, email, message });
    await newMsg.save();
    console.log("[ContactMessage] New message submitted:", name, email);

    const settings = await Settings.findOne();
    const cfg = settings?.contactForm || {};

    if (cfg.sendEmail && cfg.notificationEmail) {
      await sendNotificationEmail({
        to: cfg.notificationEmail,
        subject: `New contact message from ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    }

    res.json({ success: true, message: "Message submitted successfully." });
  } catch (err) {
    console.error("[ContactMessage] Submission error:", err);
    res.status(500).json({ success: false, message: "Submission failed", error: err.message });
  }
};

// Get all messages (admin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    console.log(`[ContactMessage] Fetched ${messages.length} messages`);
    res.json({ success: true, data: messages });
  } catch (err) {
    console.error("[ContactMessage] Fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch messages", error: err.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { read: true });
    console.log(`[ContactMessage] Marked as read: ${req.params.id}`);
    res.json({ success: true });
  } catch (err) {
    console.error("[ContactMessage] Mark as read error:", err);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    console.log(`[ContactMessage] Deleted message: ${req.params.id}`);
    res.json({ success: true });
  } catch (err) {
    console.error("[ContactMessage] Delete error:", err);
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};
