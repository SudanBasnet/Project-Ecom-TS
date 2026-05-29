import mongoose, { Document, Types } from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "user is required"],
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "product is required"],
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

//!cart model
const Cart = mongoose.model("cart", cartSchema);
export default Cart;
