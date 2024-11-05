const bookModel = require("../model/bookModel");
const authorModel = require("../model/authorModel");
const { default: mongoose } = require("mongoose");
const cloudinary = require("../config/cloudinary");
const notificationModel = require("../model/notificationModel");

const registerABook = async (req, res) => {
  try {
    // if (req.user.role !== "author") {
    //   return res.status(401).json({ message: "You are not an author." });
    // }
    const rand1 = Math.floor(Math.random() * 10000);
    const rand2 = Math.floor(Math.random() * 10000);
    const rand3 = Math.floor(Math.random() * 10000);
    const rand4 = Math.floor(Math.random() * 10000);

    const author = await authorModel.findById(req.user._id);
    const { bookName, summary } = req.body;

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    if (!bookName || !summary) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const cloudImage = await cloudinary.uploader.upload(req.file.path);

    const createABook = await bookModel.create({
      bookName,
      summary,
      author: author.userName,
      ISBN: `${rand1}-${rand2}-${rand3}-${rand4}`,
      bookImage: cloudImage.secure_url,
    });

    author.books.push(new mongoose.Types.ObjectId(createABook._id));
    await author.save();

    return res.status(201).json({
      message: "Registered a Book successfully!",
      data: createABook,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const getABook = async (req, res) => {
  try {
    const oneBook = await bookModel.findById(req.params.bookId);
    const author = await authorModel.findById(req.user._id);
    if (!oneBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.status(200).json({
      message: `Found ${oneBook.bookName} successfully!`,
      data: oneBook,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const findAllBooks = async (req, res) => {
  try {
    const author = await authorModel.findById(req.user._id);
    const allBooks = await bookModel.find();

    if (!allBooks) {
      return res.status(404).send("Books not found!");
    }

    if (!author) {
      return res.status(404).send("Author not found!");
    }

    return res.status(200).json({
      message: "All Books gotten!",
      data: allBooks,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { bookName, summary } = req.body;
    const author = await authorModel.findById(req.user._id);
    if (!author) {
      return res.status(404).send("Book not found");
    }

    const getBooks = await bookModel.findByIdAndUpdate(
      req.params.bookId,
      {
        bookName,
        summary,
      },
      { new: true }
    );

    if (!getBooks) {
      return res.status(404).send("Not found!");
    }

    return res.status(200).json({
      message: "Book has been updated successfully!",
      data: getBooks,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const deleteABook = await bookModel.findByIdAndDelete(req.params.bookId);

    if (!deleteABook) {
      return res.status(404).send("Book not found");
    }

    const author = await authorModel.findById(req.user._id);
    if (!author) {
      return res.status(404).send("Book not found");
    }

    author.books.pull(deleteABook._id);
    await author.save();

    return res.status(200).json({
      message: `${deleteABook.bookName} has been deleted successfully`,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const likeBook = async (req, res) => {
  try {
    const { authorId, bookId } = req.params;

    const author = await authorModel.findById(authorId);
    const liker = await authorModel.findById(req.user._id);
    const book = await bookModel.findById(bookId);

    if (!author) {
      return res.status(404).send("Author not Found!");
    }
    if (!liker) {
      return res.status(404).send("Liker not Found!");
    }

    if (!book) {
      return res.status(404).send("Book not Found!");
    }

    if (book.likes.includes(liker._id)) {
      return res.status(404).send("You have liked already!");
    }

    book.likes.push(liker._id) && book.dislikes.pull(liker._id);
    await book.save();

    liker.likedBooks.push(book._id);
    await liker.save();

    if (authorId === liker._id) {
      return res.status(200).json({
        message: "Likes success",
        count: book.likes.length,
      });
    }

    if (book.likes.length === 2) {
      const notification = await notificationModel.create({
        message: `${liker.name} liked your book`,
      });
      author.notifications.push(new mongoose.Types.ObjectId(notification._id));
      await author.save();
    }

    const notification = await notificationModel.create({
      message: `${liker.name} and ${
        book.likes.length - 1
      } others liked your book`,
    });

    author.notifications.push(new mongoose.Types.ObjectId(notification._id));
    await author.save();

    return res.status(200).json({
      message: "Likes success",
      count: book.likes.length,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const dislikes = async (req, res) => {
  try {
    const { authorId, bookId } = req.params;

    const author = await authorModel.findById(authorId);
    const disliker = await authorModel.findById(req.user._id);
    const book = await bookModel.findById(bookId);

    if (!author) {
      return res.status(404).send("Author not Found!");
    }

    if (!book) {
      return res.status(404).send("Book not Found!");
    }

    if (!disliker) {
      return res.status(404).send("Disliker not Found!");
    }

    if (book.dislikes.includes(disliker._id)) {
      return res.status(404).send("You have disliked this book already!");
    }

    book.dislikes.push(disliker._id) && book.likes.pull(disliker._id);

    await book.save();

    disliker.likedBooks.pull(book._id);
    await disliker.save();

    return res.status(200).json({
      message: "dislikes success",
      count: book.dislikes.length,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

const views = async (req, res) => {
  try {
    const { authorId, bookId } = req.params;

    const viewer = await authorModel.findById(req.user._id);
    const author = await authorModel.findById(authorId);
    const book = await bookModel.findById(bookId);

    if (!author) {
      return res.status(404).send("Author not Found!");
    }

    if (!book) {
      return res.status(404).send("Book not Found!");
    }
    if (!viewer) {
      return res.status(404).send("Viewer not Found!");
    }

    if (book.views.includes(viewer._id)) {
      return res.status(404).send("You already viewed this book!");
    }

    if (viewer._id === authorId) {
      return res.status(200).json({
        message: "view success",
        count: book.views.length,
      });
    }

    if (book.views.length === 2) {
      const notification = await notificationModel.create({
        message: `${viewer.name} viewed your book`,
      });

      author.notifications.push(new mongoose.Types.ObjectId(notification._id));
      await author.save();
    }

    const notification = await notificationModel.create({
      message: `${viewer.name} and ${
        book.views.length - 1
      } others viewed your book`,
    });

    author.notifications.push(new mongoose.Types.ObjectId(notification));
    await author.save();

    book.views.push(author._id);
    await book.save();

    return res.status(200).json({
      message: "view success",
      count: book.views.length,
    });
  } catch (error) {
    return res.status(404).json({
      message: "An error occured",
      data: error.message,
    });
  }
};

module.exports = {
  registerABook,
  getABook,
  findAllBooks,
  updateBook,
  deleteBook,
  likeBook,
  dislikes,
  views,
};
