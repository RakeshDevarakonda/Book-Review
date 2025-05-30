import express from "express";

import {
  addBook,
  getBooks,
  getBookById,
  searchBooks,
} from "./../controllers/book-controller.js";
import { isLogged } from "../middleware/auth.js";

const bookRouter = express.Router();
bookRouter.get("/books", getBooks);
bookRouter.get("/search", searchBooks);
bookRouter.get("/books/:id", getBookById);
bookRouter.post("/books", isLogged, addBook);
export default bookRouter;
