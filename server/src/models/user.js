import mongoose from "mongoose";

const user__schema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, lowercase: true },
    last_name: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, lowercase: true },
    username: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
  },
  { timestamps: true }
);

user__schema.index({ username: 1 });

const User = new mongoose.model("user", user__schema);

export default User;
