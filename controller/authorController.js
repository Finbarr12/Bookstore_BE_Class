const authorModel = require("../model/authorModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const notificationModel = require("../model/notificationModel");
const environment = require("../env/environmentVar");
const bookModel = require("../model/bookModel");
const authenticateJWT = require("../middleware/jwt_decode");

const signUpAuthor = async (req, res) => {
  try {
    const {
      name,
      userName,
      password,
      email,
      confirmPassword,
      phoneNumber,
      role,
    } = req.body;
    if (
      !name ||
      !userName ||
      !password ||
      !email ||
      !confirmPassword ||
      !phoneNumber
    ) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const createauthor = await authorModel.create({
      name,
      userName,
      password: hashedPassword,
      email,
      role,
      confirmPassword: hashedPassword,
      phoneNumber,
    });

    return res.status(201).json({
      message: "Created author successfully!",
      data: createauthor,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const getAnAuthor = async (req, res) => {
  try {
    const author = await authorModel.findById(req.user._id);

    if (!author) {
      return res.status(404).send("Author not found!");
    }

    return res.status(200).json({
      message: `Found author ${author.userName} successfully!`,
      data: author,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const findAllUsers = async (req, res) => {
  try {
    const allUsers = await authorModel.find();
    const author = await authorModel.findById(req.user._id);

    if (!allUsers) {
      return res.status(404).send("Not found!");
    }

    if (!author) {
      return res.status(404).send("Author not found!");
    }

    return res.status(200).json({
      message: "All users gotten!",
      data: allUsers,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, userName, password, email, confirmPassword, phoneNumber } =
      req.body;

    const getUsers = await authorModel.findByIdAndUpdate(
      req.user._id,
      {
        name,
        userName,
        password,
        email,
        confirmPassword,
        phoneNumber,
      },
      { new: true }
    );

    if (!getUsers) {
      return res.status(404).send("Not found!");
    }

    return res.status(200).json({
      message: "User updated successfully!",
      data: getUsers,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleteAUser = await authorModel.findByIdAndDelete(req.user._id);
    if (!deleteAUser) {
      return res.status(404).send("User not found");
    }
    return res.status(200).json({
      message: "User deleted successfully",
      data: deleteAUser,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const signInAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Input a value");
    }
    const checkUser = await authorModel.findOne({ email });

    if (!checkUser) {
      return res.status(404).send("Invalid Credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid Credentials");
    }

    const token = jwt.sign(
      { _id: checkUser._id, name: checkUser.name, role: checkUser.role },
      environment.JWT_SECRET_KEY,
      { expiresIn: "1hr" }
    );

    return res.status(200).json({
      message: `signed in ${checkUser.userName} successfully`,
      data: token,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const follow_an_author = async (req, res) => {
  try {
    const { followingId } = req.params;

    const follower = await authorModel.findById(req.user._id);

    if (!follower) {
      return res.status(404).json({
        message: "Follower not found!",
      });
    }

    const followed_user = await authorModel.findById(followingId);

    if (!followed_user) {
      return res.status(404).json({
        message: "followed user not found!",
      });
    }

    if (follower.following.includes(followed_user._id)) {
      return res.status(404).json({
        message: "You already followed this user!",
      });
    }

    follower.following.push(new mongoose.Types.ObjectId(followed_user._id));
    await follower.save();

    followed_user.followers.push(new mongoose.Types.ObjectId(follower._id));

    if (followed_user.followers.length === 2) {
      const notification = await notificationModel.create({
        message: `${follower.name} started following you`,
      });
      followed_user.notifications.push(
        new mongoose.Types.ObjectId(notification._id)
      );
      await followed_user.save();
    }

    const notification = await notificationModel.create({
      message: `${follower.name} and ${
        followed_user.followers.length - 1
      } others started following you`,
    });

    followed_user.notifications.push(
      new mongoose.Types.ObjectId(notification._id)
    );
    await followed_user.save();

    return res.status(200).json({
      message: `follow success.. You are now following ${followed_user.name} and your following list is ${follower.following.length}`,
      data: followed_user.userName,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const unfollow_an_author = async (req, res) => {
  try {
    const { followingId } = req.params;

    const follower = await authorModel.findById(req.user._id);

    if (!follower) {
      return res.status(404).json({
        message: "Follower not found!",
      });
    }

    const followed_user = await authorModel.findById(followingId);

    if (!followed_user) {
      return res.status(404).json({
        message: "User you want to unfollow not found!",
      });
    }

    if (follower.following.includes(followed_user._id)) {
      follower.following.pull(new mongoose.Types.ObjectId(followed_user._id));
      await follower.save();

      followed_user.followers.pull(
        new mongoose.Types.ObjectId(followed_user._id)
      );
      await followed_user.save();
    } else {
      return res.status(400).json({
        message: "You have not followed this author yet!",
      });
    }

    return res.status(200).json({
      message: `You have unfollowed ${followed_user.name}, and your followers list is now ${follower.following.length}`,
      data: follower.following.length,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const search_author = async (req, res) => {
  try {
    const { query } = req.query;
    const author = await authorModel.findById(req.user._id);

    if (!author) {
      return res.status(404).json({
        message: "Author not found!",
      });
    }

    const usersPromise = await authorModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    const booksPromise = await bookModel.find({
      $or: [{ bookName: { $regex: query, $options: "i" } }],
    });

    const [users, books] = await Promise.all([usersPromise, booksPromise]);

    if (users.length === 0 && books.length === 0) {
      return res.status(404).json({
        message: "No users or books found with the given query",
      });
    }

    return res.status(200).json({
      message: "Search Found",
      data: { users, books },
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

module.exports = {
  signUpAuthor,
  getAnAuthor,
  search_author,
  findAllUsers,
  updateUser,
  deleteUser,
  signInAuthor,
  follow_an_author,
  unfollow_an_author,
};
