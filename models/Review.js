// models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [20, "Comment cannot exceed 20 characters"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);
