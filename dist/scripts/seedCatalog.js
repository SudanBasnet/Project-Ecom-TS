"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const db_config_1 = require("../config/db.config");
const article_model_1 = __importDefault(require("../models/article.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const image = (path, publicId) => ({
    path,
    public_id: `seed/${publicId}`,
});
const categories = [
    {
        name: "Audio & Headphones",
        description: "Premium sound gear for focused work, travel, training, and everyday listening.",
        image: image("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85", "category-audio"),
    },
    {
        name: "Smart Living",
        description: "Thoughtful connected essentials that make modern homes simpler, safer, and more comfortable.",
        image: image("https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=85", "category-smart-living"),
    },
    {
        name: "Everyday Carry",
        description: "Well-designed bags and accessories made for commutes, weekends, and life on the move.",
        image: image("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85", "category-everyday-carry"),
    },
    {
        name: "Home & Workspace",
        description: "Clean, functional pieces that bring calm, character, and comfort to your favourite spaces.",
        image: image("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85", "category-workspace"),
    },
    {
        name: "Wellness & Fitness",
        description: "Reliable gear for better routines, active days, recovery sessions, and mindful downtime.",
        image: image("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85", "category-wellness"),
    },
];
const brands = [
    { name: "Auralis", description: "Immersive personal audio with a clean, considered design language." },
    { name: "Nexa Home", description: "Approachable smart-home technology designed around real routines." },
    { name: "Roam & Co.", description: "Durable everyday carry essentials for work, travel, and weekends." },
    { name: "Form Studio", description: "Minimal workspace and home objects made to feel quietly premium." },
    { name: "Pulse Lab", description: "Performance and recovery essentials for sustainable daily movement." },
];
const products = [
    ["Auralis Studio One Headphones", "Audio & Headphones", "Auralis", "329.00", 24, "Over-ear wireless headphones with adaptive noise cancellation, spatial sound, and a comfortable 40-hour fit.", "photo-1505740420928-5e560c06d30e"],
    ["Auralis Pocket Buds", "Audio & Headphones", "Auralis", "149.00", 42, "Compact noise-cancelling earbuds with crisp calls, rich bass, and a pocket-friendly wireless charging case.", "photo-1590658268037-6bf12165a8df"],
    ["Auralis Room Speaker", "Audio & Headphones", "Auralis", "219.00", 18, "A warm, room-filling wireless speaker with multi-room pairing and a refined fabric-wrapped finish.", "photo-1608043152269-423dbba4e7e1"],
    ["Nexa Ambient Lamp", "Smart Living", "Nexa Home", "89.00", 36, "A dimmable smart lamp with warm-to-cool scenes, schedules, and simple app or voice control.", "photo-1507473885765-e6ed057f782c"],
    ["Nexa Indoor Monitor", "Smart Living", "Nexa Home", "129.00", 27, "A discreet indoor monitor for temperature, humidity, air quality, and healthier daily home routines.", "photo-1558002038-1055907df827"],
    ["Nexa Mini Projector", "Smart Living", "Nexa Home", "449.00", 12, "A portable full-HD projector with auto focus, streaming support, and cinematic sound for flexible movie nights.", "photo-1601944179066-29786cb9d32a"],
    ["Roam City Backpack", "Everyday Carry", "Roam & Co.", "119.00", 31, "A weather-resistant commuter backpack with a padded laptop sleeve and quick-access organisation.", "photo-1553062407-98eeb64c6a62"],
    ["Roam Weekender", "Everyday Carry", "Roam & Co.", "159.00", 19, "A structured carry-on weekender with shoe storage, soft handles, and a luggage pass-through sleeve.", "photo-1559538850-7f0cac5d1f6c"],
    ["Roam Tech Organiser", "Everyday Carry", "Roam & Co.", "49.00", 55, "A slim organiser that keeps chargers, cables, memory cards, and small travel essentials neatly in place.", "photo-1622560480605-d83c853bc5c3"],
    ["Form Halo Desk Lamp", "Home & Workspace", "Form Studio", "139.00", 22, "A glare-controlled desk lamp with touch dimming, adjustable colour temperature, and a compact weighted base.", "photo-1534073828943-f801091bb18c"],
    ["Form Mechanical Keyboard", "Home & Workspace", "Form Studio", "179.00", 29, "A low-profile wireless mechanical keyboard with tactile switches and seamless multi-device pairing.", "photo-1587829741301-dc798b83add3"],
    ["Form Ceramic Desk Set", "Home & Workspace", "Form Studio", "69.00", 44, "A coordinated ceramic tray, pen cup, and catch-all that brings calm order to everyday workspaces.", "photo-1494438639946-1ebd1d20bf85"],
    ["Pulse Everyday Mat", "Wellness & Fitness", "Pulse Lab", "79.00", 38, "A supportive, non-slip exercise mat with comfortable cushioning for yoga, mobility, and floor training.", "photo-1601925260368-ae2f83cf8b7f"],
    ["Pulse Steel Bottle", "Wellness & Fitness", "Pulse Lab", "39.00", 64, "A vacuum-insulated stainless bottle that keeps drinks cold through workouts, commutes, and long days out.", "photo-1602143407151-7111542de6e8"],
    ["Pulse Recovery Roller", "Wellness & Fitness", "Pulse Lab", "54.00", 47, "A firm textured roller designed for post-training mobility, targeted release, and everyday muscle recovery.", "photo-1599058917212-d750089bc07e"],
];
const articles = [
    {
        title: "How to build a capsule tech collection that lasts",
        excerpt: "A practical guide to choosing fewer, better devices that work beautifully together and stay useful for years.",
        category: "Buying guide",
        author: "Maya Chen",
        read_time: "6 min read",
        image: image("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85", "article-capsule-tech"),
        href: "/products",
        featured: true,
    },
    {
        title: "The calm workspace: five details that change everything",
        excerpt: "From lighting to cable management, discover small upgrades that make deep work feel more natural.",
        category: "Workspace",
        author: "Noah Williams",
        read_time: "4 min read",
        image: image("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85", "article-calm-workspace"),
        href: "/products",
        featured: false,
    },
    {
        title: "What thoughtful ecommerce looks like in 2026",
        excerpt: "Why clearer product stories, honest recommendations, and effortless experiences are winning customer trust.",
        category: "Commerce culture",
        author: "Ava Thompson",
        read_time: "7 min read",
        image: image("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85", "article-commerce-2026"),
        href: "/products",
        featured: false,
    },
];
const seedCatalog = async () => {
    const dbUri = process.env.DB_URI;
    if (!dbUri)
        throw new Error("DB_URI is required to seed the catalog.");
    try {
        await mongoose_1.default.connect(dbUri);
    }
    catch (error) {
        const fallbackUri = (0, db_config_1.getAtlasFallbackUri)(dbUri);
        if (!fallbackUri || error.code !== "EBADRESP") {
            throw error;
        }
        console.log("Atlas SRV lookup failed. Seeding through direct hosts.");
        await mongoose_1.default.connect(fallbackUri);
    }
    await product_model_1.default.deleteMany({});
    await cart_model_1.default.deleteMany({});
    await category_model_1.default.deleteMany({});
    await brand_model_1.default.deleteMany({});
    await article_model_1.default.deleteMany({});
    const insertedCategories = await category_model_1.default.insertMany(categories);
    const insertedBrands = await brand_model_1.default.insertMany(brands);
    const categoryIds = new Map(insertedCategories.map((entry) => [entry.name, entry._id]));
    const brandIds = new Map(insertedBrands.map((entry) => [entry.name, entry._id]));
    await product_model_1.default.insertMany(products.map(([name, category, brand, price, stock, description, photo]) => ({
        name,
        description,
        price,
        stock,
        category: categoryIds.get(category),
        brand: brandIds.get(brand),
        cover_image: image(`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=85`, `product-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`),
        image: [],
        new_arrival: true,
        featured: name === "Auralis Studio One Headphones" || name === "Roam City Backpack" || name === "Form Mechanical Keyboard",
    })));
    await article_model_1.default.insertMany(articles);
    console.log(`Seeded ${categories.length} categories, ${brands.length} brands, ${products.length} products, and ${articles.length} articles.`);
};
seedCatalog()
    .catch((error) => {
    console.error("Catalog seed failed:", error);
    process.exitCode = 1;
})
    .finally(async () => {
    await mongoose_1.default.disconnect();
});
