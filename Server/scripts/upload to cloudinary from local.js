require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Folder where local images are stored
const imagesDir = path.join(__dirname, "images");

// Ensure logs directory exists
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Log file setup
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logFilename = `upload-log-${cloudinary.config().cloud_name}-${timestamp}.txt`;
const logFile = path.join(logsDir, logFilename);

function writeLog(message) {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, entry, "utf-8");
}

(async () => {
  writeLog("=== Upload Started ===");

  const files = fs.readdirSync(imagesDir).filter((file) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  for (const file of files) {
    const filePath = path.join(imagesDir, file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "partyworld/occasions",
      });

      const logEntry = `✅ Uploaded: ${file} | ➡️ ${result.secure_url}`;
      console.log(logEntry);
      writeLog(logEntry);
    } catch (err) {
      const errorEntry = `❌ Error uploading: ${file} ❗ ${err.message}`;
      console.error(errorEntry);
      writeLog(errorEntry);
    }
  }

  writeLog("=== Upload Completed ===");
  console.log("📄 Log saved to:", logFile);
})();
