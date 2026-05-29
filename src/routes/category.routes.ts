import express from "express";

import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/category.controller";
import { Only_Admins, Role } from "../types/enum.types";
import { authenticate } from "../middlewares/auth.middleware";
import { multerUploader } from "../middlewares/multer.middleware";

const upload = multerUploader();

const router = express.Router();

//! get all categories
router.get("/", getAll);

//! get category by id
router.get("/:id", getById);

//! create category
// router.post("/", authenticate(Only_Admins), create);

router.post("/", authenticate(Only_Admins), upload.single("image"), create);
router.put("/:id", authenticate(Only_Admins), upload.single("image"), update);

//! update category
// router.put("/:id", authenticate(Only_Admins), update);

//! delete category
router.delete("/:id", authenticate(Only_Admins), remove);

export default router;
