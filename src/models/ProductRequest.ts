import mongoose, { Schema, models, model } from "mongoose";

const ProductRequestSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    size: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.ProductRequest ||
  model("ProductRequest", ProductRequestSchema);