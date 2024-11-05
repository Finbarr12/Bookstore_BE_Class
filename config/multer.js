const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const bookUploads = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 },
}).single("bookImage");

module.exports = bookUploads;
