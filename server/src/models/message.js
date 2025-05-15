import mongoose from "mongoose";

const message__schema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "conversation",
    },
  },
  { timestamps: true }
);

const Message = new mongoose.model("message", message__schema);

export default Message;
