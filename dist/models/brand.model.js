"use strict";
//models/brand.model.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const brandSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "brand name is required"],
        trim: true,
        minlength: [2, "brand name must be at least 2 characters"],
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
const Brand = mongoose_1.default.model("Brand", brandSchema);
exports.default = Brand;
