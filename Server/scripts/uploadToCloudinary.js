require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


 // Input JSON of image URLs
 const imageFile = path.join(__dirname, "occasionImages.json");
 const imageUrls = JSON.parse(fs.readFileSync(imageFile, "utf-8"));
 
 // Ensure logs directory exists
 const logsDir = path.join(__dirname, "logs");
 if (!fs.existsSync(logsDir)) {
   fs.mkdirSync(logsDir);
 }
 
 // Create a unique log filename with timestamp and cloudinary name
 const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
 const logFilename = `upload-log-${cloudinary.config().cloud_name}-${timestamp}.txt`;
 const logFile = path.join(logsDir, logFilename);
 
 // Helper to write log entries
 function writeLog(message) {
   const entry = `[${new Date().toISOString()}] ${message}\n`;
   fs.appendFileSync(logFile, entry, "utf-8");
 }


 (async () => {
  writeLog("=== Upload Started ===");

  for (const originalUrl of imageUrls) {
    const cleanUrl = originalUrl.split("?")[0];

    try {
      const result = await cloudinary.uploader.upload(cleanUrl, {
        folder: "banners",
      });


      const logEntry = `✅ Uploaded: ${result.original_filename} | ➡️ ${result.secure_url}`;
      console.log(logEntry);
      writeLog(logEntry);
    } catch (err) {
      const errorEntry = `❌ Error uploading: ${cleanUrl} ❗ ${err.message}`;
      console.error(errorEntry);
      writeLog(errorEntry);
    }
  }

  writeLog("=== Upload Completed ===");
  console.log("📄 Log saved to:", logFile);
})();
