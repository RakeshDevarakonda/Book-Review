import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
      maxlength: [100, "Email cannot exceed 100 characters"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, 
    },
   
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
