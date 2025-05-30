import Review from "../models/Review.js";
import mongoose from "mongoose";
import { throwError } from "../utils/throw-error.js"; // your throwError util

const validateRating = (rating) =>
  typeof rating === "number" && rating >= 1 && rating <= 5;
const validateComment = (comment) => !comment || comment.length <= 500;
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const submitReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id;



    if (!validateRating(rating)) {
      throwError(400, "Rating must be a number between 1 and 5");
    }

    if (!validateComment(comment)) {
      throwError(400, "Comment cannot exceed 500 characters");
    }
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throwError(400, "Invalid book ID");
    }

    const exists = await Review.findOne({ user: req.user._id, book: bookId });
    if (exists) {
      throwError(400, "You have already submitted a review for this book");
    }

    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      comment: comment || undefined,
    });

    res.status(201).json({
      success: true,
      data: review,
      message: "Review submitted successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      throwError(400,firstError)
    }
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;

    if (!isValidObjectId(reviewId)) {
      throwError(400, "Invalid review ID");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      throwError(404, "Review not found");
    }

    if (review.user.toString() !== req.user._id.toString()) {
      throwError(403, "Unauthorized to update this review");
    }

    if (rating !== undefined && !validateRating(rating)) {
      throwError(400, "Rating must be a number between 1 and 5");
    }

    if (!validateComment(comment)) {
      throwError(400, "Comment cannot exceed 500 characters");
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    review.editedAt = new Date();

    await review.save();

    res.json({
      success: true,
      data: review,
      message: "Review updated successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      throwError(400,firstError)
    }
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;

    if (!isValidObjectId(reviewId)) {
      throwError(400, "Invalid review ID");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      throwError(404, "Review not found");
    }


    if (review.user.toString() !== req.user._id.toString()) {
      throwError(403, "Unauthorized to delete this review");
    }

    await review.deleteOne();

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      throwError(400,firstError)
    }
    next(error);
  }
};
