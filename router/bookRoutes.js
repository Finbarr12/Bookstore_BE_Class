const { Router } = require("express");
const {
  registerABook,
  getABook,
  findAllBooks,
  updateBook,
  deleteBook,
  likeBook,
  dislikes,
  views,
} = require("../controller/bookController");
const bookUploads = require("../config/multer");
const authenticateJWT = require("../middleware/jwt_decode");

const router = Router();

router.post("/sign_up_a_book", authenticateJWT, bookUploads, registerABook);
router.get("/get_one_book/:bookId", authenticateJWT, getABook);
router.get("/get_all_books", authenticateJWT, findAllBooks);
router.patch("/update_a_book/:bookId", authenticateJWT, updateBook);
router.delete("/delete_a_book/:bookId", authenticateJWT, deleteBook);
router.patch("/like_a_book/:authorId/:bookId", authenticateJWT, likeBook);
router.patch("/dislike_a_book/:authorId/:bookId", authenticateJWT, dislikes);
router.patch("/view_a_book/:authorId/:bookId", authenticateJWT, views);
module.exports = router;
