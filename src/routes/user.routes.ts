import express from "express";
import { deleteById, getAll, getbyid } from "../controllers/user.controller";

const router = express.Router();

//! get all
router.get("/", getAll);

//!get by id
router.get("/:id", getbyid);

//!delete by id
router.delete("/:id", deleteById);

export default router;
