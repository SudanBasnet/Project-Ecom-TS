"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../types/enum.types");
const router = express_1.default.Router();
//! get cart
router.get("/", (0, auth_middleware_1.authenticate)(enum_types_1.All_Users), cart_controller_1.getCart);
//! add to cart
router.post("/:productId", (0, auth_middleware_1.authenticate)(enum_types_1.All_Users), cart_controller_1.addToCart);
//! update cart item quantity
router.put("/:productId", (0, auth_middleware_1.authenticate)(enum_types_1.All_Users), cart_controller_1.updateCartItem);
//! remove from cart
router.delete("/:productId", (0, auth_middleware_1.authenticate)(enum_types_1.All_Users), cart_controller_1.removeFromCart);
//! clear cart
router.delete("/", (0, auth_middleware_1.authenticate)(enum_types_1.All_Users), cart_controller_1.clearCart);
exports.default = router;
