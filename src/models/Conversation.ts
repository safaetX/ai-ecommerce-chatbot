import mongoose, { Schema, models, model } from "mongoose";

const ConversationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Conversation ||
  model("Conversation", ConversationSchema);