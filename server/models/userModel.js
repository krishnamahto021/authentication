const mongoose = require("mongoose");
const userModel = mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String },
    password: { type: String, required: true },
    token: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);
module.exports = User;
