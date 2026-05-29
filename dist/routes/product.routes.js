"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const router = (0, express_1.Router)();
const upload = (0, multer_middleware_1.multerUploader)();
//? get all
router.get("/", product_controller_1.getAll);
//? get by category
router.get("/category/:id", product_controller_1.getByCategory);
//? featured
router.get("/featured", product_controller_1.getFeaturedProducts);
//? new arrivals
router.get("/new-arrivals", product_controller_1.getNewProducts);
//? get by id
router.get("/:id", product_controller_1.getById);
//? cretae
router.post("/", upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 6,
    },
]), 
// authenticate(Only_Admins),
product_controller_1.create);
//? update
router.put("/:id", upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 6,
    },
]), product_controller_1.update);
//? delete
router.delete("/:id", product_controller_1.remove);
exports.default = router;
