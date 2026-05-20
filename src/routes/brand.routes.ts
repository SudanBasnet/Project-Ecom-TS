//routes/brand.routes.ts

import express from "express";

import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/brand.controller";

const router = express.Router();

//!create brand
router.post("/", create);

//!get all brands
router.get("/", getAll);

//!get brand by id
router.get("/:id", getById);

//!update brand
router.put("/:id", update);

//!delete brand
router.delete("/:id", remove);

export default router;
