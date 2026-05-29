"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../types/enum.types");
const router = express_1.default.Router();
//!get wishlist
router.get("/", (0, auth_middleware_1.authenticate)(enum_types_1.All_Users), wishlist_controller_1.getWishlist);
//! add to wishlist
router.post("/:productId", (0, auth_middleware_1.authenticate)(enum_types_1.All_Users), wishlist_controller_1.addToWishlist);
//! remove from wishlist
router.delete("/:productId", (0, auth_middleware_1.authenticate)(enum_types_1.All_Users), wishlist_controller_1.removeFromWishlist);
//!clear wishlist
router.delete("/", (0, auth_middleware_1.authenticate)(enum_types_1.All_Users), wishlist_controller_1.clearWishlist);
exports.default = router;
