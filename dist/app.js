"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const index_1 = __importDefault(require("./routes/index"));
const appError_utils_1 = __importDefault(require("./utils/appError.utils"));
const notFound_middleware_1 = require("./middlewares/notFound.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const env_config_1 = __importDefault(require("./config/env.config"));
//!creating express app instance
const app = (0, express_1.default)();
const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, "");
const allowedOrigins = env_config_1.default.allow_origins
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
//!using cors
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
            return callback(null, true);
        }
        return callback(new appError_utils_1.default("Cors error", 400));
    },
    credentials: true,
}));
//!body parser
app.use(express_1.default.json({ limit: "10mb" }));
//!using middlewares
//*cookieparser
app.use((0, cookie_parser_1.default)());
//!health route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "server is up and running",
        success: true,
        status: "success",
    });
});
//!using routes
app.use("/api/v1", index_1.default);
//!path not found error middleware
app.use(notFound_middleware_1.notFound);
//!error handler
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
