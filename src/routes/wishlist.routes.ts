import express from "express";
import {
  addToWishlist,
  clearWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { All_Users } from "../types/enum.types";

const router = express.Router();

//!get wishlist
router.get("/", authenticate(All_Users), getWishlist);

//! add to wishlist
router.post("/:productId", authenticate(All_Users), addToWishlist);

//! remove from wishlist
router.delete("/:productId", authenticate(All_Users), removeFromWishlist);

//!clear wishlist
router.delete("/", authenticate(All_Users), clearWishlist);

export default router;
