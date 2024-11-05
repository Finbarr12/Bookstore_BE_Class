const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: 6,
  },
  authorImage: {
    type: String,
  },

  role: {
    type: String,
    enum: ["user", "author"],
    default: "user",
  },

  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
    },
  ],

  likedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
    },
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "authors",
    },
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "authors",
    },
  ],
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "notifications",
    },
  ],
});

const authorModel = mongoose.model("authors", authorSchema);
module.exports = authorModel;
