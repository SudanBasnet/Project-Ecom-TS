import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes";
import wishlistRoutes from "./wishlist.routes";
import cartRoutes from "./cart.routes";
import brandRoutes from "./brand.routes";
import articleRoutes from "./article.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/cart", cartRoutes);
router.use("/brands", brandRoutes);
router.use("/articles", articleRoutes);

export default router;
