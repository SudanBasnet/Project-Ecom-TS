"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const router = express_1.default.Router();
//! create product
router.post("/", product_controller_1.create);
//! get all products
router.get("/", product_controller_1.getAll);
//! get products by category
router.get("/category/:id", product_controller_1.getByCategory);
//! get featured products
router.get("/featured", product_controller_1.getFeaturedProducts);
//! get new arrival products
router.get("/new-arrivals/all", product_controller_1.getNewProducts);
//! get product by id
router.get("/:id", product_controller_1.getById);
//! update product
router.put("/:id", product_controller_1.update);
//! delete product
router.delete("/:id", product_controller_1.remove);
exports.default = router;
