import { Router } from "express";
import {
  create,
  getAll,
  getByCategory,
  getById,
  getFeaturedProducts,
  getNewProducts,
} from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth.middlware";
import { Only_Admins } from "../types/enum.types";
import { multerUploader } from "../middlewares/multer.middleware";

const router = Router();
const upload = multerUploader();

//? get all
router.get("/", getAll);

//? get by category
router.get("/category/:id", getByCategory);

//? featured
router.get("/featured", getFeaturedProducts);

//? new arrivals
router.get("/new-arrivals", getNewProducts);

//? get by id
router.get("/:id", getById);

//? cretae
router.post(
  "/",
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 6,
    },
  ]),
  // authenticate(Only_Admins),
  create,
);

export default router;
