import express from "express";

import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/category.controller";
import { Role } from "../types/enum.types";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

//! get all categories
router.get("/", getAll);

//! get category by id
router.get("/:id", getById);

//! create category
router.post("/", authenticate([Role.ADMIN, Role.SUPER_ADMIN]), create);

//! update category
router.put("/:id", authenticate([Role.ADMIN, Role.SUPER_ADMIN]), update);

//! delete category
router.delete("/:id", authenticate([Role.ADMIN, Role.SUPER_ADMIN]), remove);

export default router;
