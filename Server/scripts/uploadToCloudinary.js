require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageFile = path.join(__dirname, "occasionImages.json");
const imageUrls = JSON.parse(fs.readFileSync(imageFile, "utf-8"));

(async () => {
  for (const originalUrl of imageUrls) {
    const cleanUrl = originalUrl.split("?")[0];

    try {
      const result = await cloudinary.uploader.upload(cleanUrl, {
        folder: "partyworld/occasions",
      });
      console.log("✅ Uploaded:", result.original_filename);
      console.log("➡️ URL:", result.secure_url);
    } catch (err) {
      console.error("❌ Error uploading:", cleanUrl, err.message);
    }
  }
})();
