const Notification = require("../model/notificationModel");
const authorModel = require("../model/authorModel");

const get_notification_for_a_user = async (req, res) => {
  const author = await authorModel.findById(req.user._id);

  if (!author) {
    return res.status(404).json({
      message: "author not found!",
    });
  }
  try {
    const notification = await Notification.findById(req.params.notificationId);

    return res.status(200).json({
      message: "Notification gotten",
      data: notification,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const read_notification = async (req, res) => {
  const author = await authorModel.findById(req.user._id);

  if (!author) {
    return res.status(404).json({
      message: "author not found!",
    });
  }
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true },
      { new: true }
    );
    return res.status(200).json({
      message: "Notificaion has been opened!",
      data: notification,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

module.exports = {
  get_notification_for_a_user,
  read_notification,
};
