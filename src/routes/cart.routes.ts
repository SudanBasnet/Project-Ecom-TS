import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { All_Users } from "../types/enum.types";

const router = express.Router();

//! get cart
router.get("/", authenticate(All_Users), getCart);

//! add to cart
router.post("/:productId", authenticate(All_Users), addToCart);

//! update cart item quantity
router.put("/:productId", authenticate(All_Users), updateCartItem);

//! remove from cart
router.delete("/:productId", authenticate(All_Users), removeFromCart);

//! clear cart
router.delete("/", authenticate(All_Users), clearCart);

export default router;
