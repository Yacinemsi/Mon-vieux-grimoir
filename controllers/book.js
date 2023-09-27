const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Assurez-vous que req.auth est bien défini par un middleware d'authentification
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId.toString() !== req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId.toString() !== req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBook = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.rateBook = async (req, res, next) => {
  console.log(req.body);
  const { userId, rating } = req.body;
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const userRating = book.ratings.find(
      (rating) => rating.userId === req.auth.userId
    );

    if (userRating) {
      return res
        .status(400)
        .json({ error: "User has already rated this book" });
    }

    const newRating = {
      userId,
      grade: rating,
    };

    book.ratings.push(newRating);

    book.averageRating =
      book.ratings.reduce((acc, curr) => acc + curr.grade, 0) /
      book.ratings.length;
    book.averageRating = book.averageRating.toFixed(2);

    await book
      .save()
      .then((newBook) => {
        console.log("newBook rating", newBook);
        res.status(200).json(newBook);
      })
      .catch((error) => {
        console.error("Error while saving the book: ", error);
        res.status(401).json({ error });
      });
  } catch (error) {
    res.status(500).json({ error });
  }
};
