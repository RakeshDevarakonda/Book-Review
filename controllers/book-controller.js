import mongoose from "mongoose";
import Book from "../models/Book.js";
import Review from "../models/Review.js";
import { throwError } from "../utils/throw-error.js";

const validateBookInput = ({ title, author, genre }) => {
  const errors = [];
  if (!title || !title.trim()) errors.push("Title is required");
  else if (title.trim().length > 15)
    errors.push("Title cannot exceed 15 characters");

  if (!author || !author.trim()) errors.push("Author is required");
  else if (author.trim().length > 15)
    errors.push("Author name cannot exceed 15 characters");

  if (!genre || !genre.trim()) errors.push("Genre is required");
  else if (genre.trim().length > 15)
    errors.push("Genre cannot exceed 15 characters");

  return errors;
};

export const addBook = async (req, res, next) => {
  try {
    const { title, author, genre, description } = req.body;

    const errors = validateBookInput({ title, author, genre });
    if (errors.length > 0) {
      throwError(400, errors.join(", "));
    }

    
    const bookData = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      description: description?.trim(),
      createdBy: req.user._id,
    };

    const book = await Book.create(bookData);
    res.status(201).json({
      data: book,
      message: "Book created successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      throwError(400, firstError);
    }
    next(error);
  }
};

export const getBooks = async (req, res, next) => {
  try {
    const {
      author,
      genre,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};
    if (author) query.author = new RegExp(author.trim(), "i");
    if (genre) query.genre = genre.trim();

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      throwError(400, "Invalid pagination parameters");
    }

    const sortOrder = order === "desc" ? -1 : 1;
    const sortOptions = { [sort]: sortOrder };

    const books = await Book.find(query)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      data: books,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalDocs: total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      throwError(400, firstError);
    }
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throwError(400, "Invalid book ID");
    }

    const book = await Book.findById(id);
    if (!book) {
      throwError(404, "Book not found");
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      throwError(400, "Invalid pagination parameters for reviews");
    }

    const totalReviews = await Review.countDocuments({ book: book._id });

    const reviews = await Review.find({ book: book._id })
      .populate("user", "name")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const allReviews = await Review.find({ book: book._id });
    const avgRating = allReviews.length
      ? (
          allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        ).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        book,
        avgRating: parseFloat(avgRating),
        reviews,
        reviewCount: totalReviews,
        reviewPagination: {
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalReviews / limitNum),
        },
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      throwError(400, firstError);
    }
    next(error);
  }
};

export const searchBooks = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q || !q.trim()) {
      throwError(400, "Search query is required");
    }

    const books = await Book.find({
      $or: [
        { title: new RegExp(q.trim(), "i") },
        { author: new RegExp(q.trim(), "i") },
      ],
    }).limit(parseInt(limit, 10));

    res.json({
      success: true,
      data: books,
      count: books.length,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      throwError(400, firstError);
    }
    next(error);
  }
};
