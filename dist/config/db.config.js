"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ATLAS_FALLBACK_HOSTS = [
    "ac-pwyyh3p-shard-00-00.lmyqm5s.mongodb.net:27017",
    "ac-pwyyh3p-shard-00-01.lmyqm5s.mongodb.net:27017",
    "ac-pwyyh3p-shard-00-02.lmyqm5s.mongodb.net:27017",
].join(",");
const getAtlasFallbackUri = (dbUri) => {
    if (!dbUri.startsWith("mongodb+srv://"))
        return null;
    const url = new URL(dbUri);
    if (url.hostname !== "ecommerce.lmyqm5s.mongodb.net")
        return null;
    const credentials = url.username
        ? `${url.username}${url.password ? `:${url.password}` : ""}@`
        : "";
    url.searchParams.set("tls", "true");
    url.searchParams.set("authSource", "admin");
    url.searchParams.set("replicaSet", "atlas-lwqddq-shard-0");
    return `mongodb://${credentials}${ATLAS_FALLBACK_HOSTS}${url.pathname}?${url.searchParams.toString()}`;
};
const connectDatabase = async (DB_URI) => {
    try {
        await mongoose_1.default.connect(DB_URI);
        console.log("Database Connected");
    }
    catch (error) {
        const fallbackUri = getAtlasFallbackUri(DB_URI);
        if (fallbackUri && error.code === "EBADRESP") {
            console.log("Atlas SRV lookup failed. Retrying with direct hosts.");
            try {
                await mongoose_1.default.connect(fallbackUri);
                console.log("Database Connected");
                return;
            }
            catch (fallbackError) {
                console.log("---------------Database connection error----------");
                console.log(fallbackError);
                return;
            }
        }
        console.log("---------------Database connection error----------");
        console.log(error);
    }
};
exports.default = connectDatabase;
