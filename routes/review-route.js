import express from "express";

import {
  submitReview,
  updateReview,
  deleteReview,
} from "../controllers/review-controller.js";
import { isLogged } from "../middleware/auth.js";

const reviewRouter = express.Router();
reviewRouter.post("/books/:id/reviews", isLogged, submitReview);
reviewRouter.put("/reviews/:id", isLogged, updateReview);
reviewRouter.delete("/reviews/:id", isLogged, deleteReview);
export default reviewRouter;
