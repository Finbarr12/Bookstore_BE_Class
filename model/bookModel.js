const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
    maxlength: 400,
  },
  author: {
    type: String,
    required: true,
  },
  likes: {
    type: [],
  },
  dislikes: {
    type: [],
  },
  views: {
    type: [],
  },
  ISBN: {
    type: String,
    required: true,
    unique: true,
  },
  bookImage: {
    type: String,
    // required: true,
  },
});

const bookModel = mongoose.model("books", bookSchema);
module.exports = bookModel;
