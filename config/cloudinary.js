const environment = require("../env/environmentVar");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: environment.CLOUD_NAME,
  api_key: environment.API_KEY,
  api_secret: environment.API_SECRET, // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;
