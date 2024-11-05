const { Router } = require("express");
const {
  get_notification_for_a_user,
  read_notification,
} = require("../controller/notificationController");
const authenticateJWT = require("../middleware/jwt_decode");

const router = Router();

router.get(
  "/get_notification_for_a_user/:notificationId",
  authenticateJWT,
  get_notification_for_a_user
);
router.patch(
  "/read_notification/:notificationId",
  authenticateJWT,
  read_notification
);

module.exports = router;
