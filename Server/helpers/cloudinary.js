const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload **multiple** images to Cloudinary under `/products/`
async function uploadMultipleImages(files) {
  const uploadPromises = files.map(async (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const url = "data:" + file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(url, {
      folder: "products", // 📁 Store images inside 'products/' folder
      resource_type: "image",
    });

    return result.secure_url; // Return only the image URL
  });

  return Promise.all(uploadPromises);
}

module.exports = { upload, uploadMultipleImages };
