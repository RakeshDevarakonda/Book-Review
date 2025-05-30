import User from "../models/User.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import { throwError } from "../utils/throw-error.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      throwError(400, "All fields are required.");
    }

    if (password !== confirmPassword) {
      throwError(400, "Passwords do not match.");
    }

    if (!validator.isEmail(email)) {
      throwError(400, "Invalid email format.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throwError(409, "User already exists.");
    }

    await User.create({ name, email, password });

    res.status(201).json({ message: "signup Succes" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      throwError(400, firstError);
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throwError(400, "Email and password are required.");
    }

    if (!validator.isEmail(email)) {
      throwError(400, "Invalid email format.");
    }

    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      throwError(401, "User Not Found");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throwError(401, "Invalid email or password.");
    }

    const token = generateToken(user._id);
    res.status(200).json({ token });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      throwError(400, firstError);
    }
    next(error);
  }
};
