import express from "express";
import { getAll, getbyid } from "../controllers/user.controller";

const router = express.Router();

//! get all
router.get("/", getAll);

//!get by id
router.get("/:id", getbyid);

export default router;
