import express from "express";
import { getAll } from "../controllers/user.controller";

const router = express.Router();

//! get all
router.get("/", getAll);

//!get by id

export default router;
