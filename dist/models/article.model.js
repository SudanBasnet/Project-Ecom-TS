"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const articleSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    read_time: { type: String, required: true, trim: true },
    image: {
        path: { type: String, required: true },
        public_id: { type: String, required: true },
    },
    href: { type: String, required: true },
    featured: { type: Boolean, default: false },
}, { timestamps: true });
const Article = mongoose_1.default.model("article", articleSchema);
exports.default = Article;
