const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configurazione di Cloudinary
// filepath: cloudinary.js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage per multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "striveBlog", // Nome della cartella su Cloudinary
    format: async (req, file) => "jpg", // Forza JPG, puoi personalizzare
    public_id: (req, file) => file.originalname.split(".")[0], // Nome del file
  },
});

// Middleware di upload con multer
const upload = multer({ storage });

module.exports = { cloudinary, upload };
