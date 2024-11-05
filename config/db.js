const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/test";
const live_uri =
  "mongodb+srv://FinbarrDB:codelab06@cluster0.2xzneqt.mongodb.net/bookstoreDb?retryWrites=true&w=majority&appName=Cluster0";

const dbConnect = async () => {
  try {
    await mongoose.connect(live_uri);
    console.log("connected successfully to db");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
