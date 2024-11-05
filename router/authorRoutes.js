const { Router } = require("express");
const {
  signUpAuthor,
  getAnAuthor,
  findAllUsers,
  updateUser,
  deleteUser,
  signInAuthor,
  follow_an_author,
  unfollow_an_author,
  search_author,
} = require("../controller/authorController");
const authenticateJWT = require("../middleware/jwt_decode");

const router = Router();

router.route("/sign_up_author").post(signUpAuthor);
router.get("/get_one_user", authenticateJWT, getAnAuthor);
router.get("/get_all_users", authenticateJWT, findAllUsers);
router.get("/search_author", authenticateJWT, search_author);
router.patch("/update_users", authenticateJWT, updateUser);
router.delete("/delete_user", authenticateJWT, deleteUser);
router.route("/sign_in_author/").post(signInAuthor);
router.patch("/follow_a_user/:followingId", authenticateJWT, follow_an_author);
router.patch(
  "/unfollow_a_user/:followingId",
  authenticateJWT,
  unfollow_an_author
);

module.exports = router;
