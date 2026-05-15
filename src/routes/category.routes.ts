import express from "express";

import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/category.controller";

const router = express.Router();

//! get all categories
router.get("/", getAll);

//! get category by id
router.get("/:id", getById);

//! create category
router.post("/", create);

//! update category
router.put("/:id", update);

//! delete category
router.delete("/:id", remove);

export default router;
