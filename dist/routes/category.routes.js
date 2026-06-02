"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const enum_types_1 = require("../types/enum.types");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const upload = (0, multer_middleware_1.multerUploader)();
const router = express_1.default.Router();
//! get all categories
router.get("/", category_controller_1.getAll);
//! get category by id
router.get("/:id", category_controller_1.getById);
//! create category
// router.post("/", authenticate(Only_Admins), create);
router.post("/", (0, auth_middleware_1.authenticate)(enum_types_1.Only_Admins), upload.single("image"), category_controller_1.create);
router.put("/:id", (0, auth_middleware_1.authenticate)(enum_types_1.Only_Admins), upload.single("image"), category_controller_1.update);
//! update category
// router.put("/:id", authenticate(Only_Admins), update);
//! delete category
router.delete("/:id", (0, auth_middleware_1.authenticate)(enum_types_1.Only_Admins), category_controller_1.remove);
exports.default = router;
