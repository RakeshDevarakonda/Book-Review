import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [15, "Title cannot exceed 15 characters"],
    },
    
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: [15, "Author name cannot exceed 15 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      maxlength: [15, "genre  cannot exceed 15 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Book", bookSchema);
