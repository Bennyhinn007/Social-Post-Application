const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = async (
  buffer,
  mimeType,
  folder = "social-post-app",
) => {
  const safeMimeType = mimeType || "image/jpeg";
  const dataUri = `data:${safeMimeType};base64,${buffer.toString("base64")}`;

  return cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "auto",
    overwrite: false,
  });
};

module.exports = {
  cloudinary,
  uploadBufferToCloudinary,
};
