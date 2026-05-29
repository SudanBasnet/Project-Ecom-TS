import { Router } from "express";
import {
  create,
  getAll,
  getByCategory,
  getById,
  getFeaturedProducts,
  getNewProducts,
  remove,
  update,
} from "../controllers/product.controller";
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

//? update
router.put(
  "/:id",
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
  update,
);

//? delete
router.delete("/:id", remove);

export default router;
