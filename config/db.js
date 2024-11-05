const mongoose = require("mongoose");
const environment = require("../env/environmentVar");

const uri = "mongodb://127.0.0.1:27017/test";
const live_uri = environment.MONGODB_URI;

const dbConnect = async () => {
  try {
    await mongoose.connect(live_uri);
    console.log("connected successfully to db");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
