import { Router } from "express";
import { getAll } from "../controllers/article.controller";

const router = Router();
router.get("/", getAll);

export default router;
