import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["electronics", "clothing", "food", "other"],
    },

    newPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    oldPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    available: {
      type: Boolean,
      default: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: [String],
    slug: { type: String, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, 
  },
);

export default mongoose.model("Product", productSchema);
