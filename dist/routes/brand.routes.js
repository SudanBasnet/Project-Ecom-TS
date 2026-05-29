"use strict";
//routes/brand.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("../controllers/brand.controller");
const router = express_1.default.Router();
//!create brand
router.post("/", brand_controller_1.create);
//!get all brands
router.get("/", brand_controller_1.getAll);
//!get brand by id
router.get("/:id", brand_controller_1.getById);
//!update brand
router.put("/:id", brand_controller_1.update);
//!delete brand
router.delete("/:id", brand_controller_1.remove);
exports.default = router;
