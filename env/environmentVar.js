const dotenv = require("dotenv");

dotenv.config();

const environment = {
  PORT: process.env.PORT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  API_SECRET: process.env.API_SECRET,
  API_KEY: process.env.API_KEY,
  CLOUD_NAME: process.env.CLOUD_NAME,
};

module.exports = environment;
