import mongoose from "mongoose";

const conversation__schema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    model: { type: String, default: "gpt-4o-mini" },
    title: { type: String, default: "New Chat" },
  },
  { timestamps: true }
);

const Conversation = new mongoose.model("conversation", conversation__schema);

export default Conversation;
