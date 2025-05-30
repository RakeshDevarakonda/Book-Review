import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth-route.js";
import bookRouter from "./routes/book-route.js";
import reviewRouter from "./routes/review-route.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();
console.log(process.env.JWT_SECRET);

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", bookRouter);
app.use("/api", reviewRouter);

app.use((err, req, res, next) => {
  console.log("Error:", err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
