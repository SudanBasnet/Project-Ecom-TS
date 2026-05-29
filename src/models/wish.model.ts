import mongoose from "mongoose";
//! wishlist schema

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
      unique: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "product is required"],
      },
    ],
  },
  { timestamps: true },
);

//!wishlist model
const Wishlist = mongoose.model("wishlist", wishlistSchema);
export default Wishlist;
