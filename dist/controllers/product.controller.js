"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewProducts = exports.getFeaturedProducts = exports.getByCategory = exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const product_model_1 = __importDefault(require("../models/product.model"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const category_model_1 = __importDefault(require("../models/category.model"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const folder = "/products";
//* get all products
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { query, category, brand, minPrice, maxPrice, limit = "10", page = "1", } = req.query;
    const perPage = Number(limit);
    const currPage = Number(page);
    const skip = (currPage - 1) * perPage;
    const filter = {};
    if (query) {
        filter.$or = [
            {
                name: { $regex: query, $options: "i" },
            },
            {
                description: { $regex: query, $options: "i" },
            },
        ];
    }
    if (category) {
        filter.category = category;
    }
    if (brand) {
        filter.brand = brand;
    }
    //! price filter
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }
    const products = await product_model_1.default.find(filter).skip(skip).limit(perPage);
    const count = await product_model_1.default.countDocuments(filter);
    const { total_count, total_pages, current_page, next_page, prev_page } = (0, pagination_utils_1.getPagination)(count, perPage, currPage);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Products fetched",
        statusCode: 200,
        data: products,
        meta: {
            total_count,
            total_pages,
            current_page,
            next_page,
            prev_page,
        },
    });
});
//* get by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product) {
        throw new appError_utils_1.default(`product ${id} not found `, 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Product ${id} fetched`,
        statusCode: 200,
        data: product,
    });
});
//* create
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { name, description, price, stock, category, brand, new_arrival, featured, } = req.body;
    //! files
    const files = req.files;
    const cover_image = files?.cover_image;
    const images = files?.images;
    if (!name || !price || !stock) {
        throw new appError_utils_1.default("name , price & stock are required", 400);
    }
    if (!category) {
        throw new appError_utils_1.default("category required", 400);
    }
    if (!brand) {
        throw new appError_utils_1.default("brand required", 400);
    }
    if (!cover_image?.[0]) {
        throw new appError_utils_1.default("cover_image is required", 400);
    }
    const product = new product_model_1.default({
        name,
        stock,
        price,
        description,
        new_arrival,
        featured,
    });
    const p_category = await category_model_1.default.findOne({ _id: category });
    if (!p_category) {
        throw new appError_utils_1.default("Category not found", 400);
    }
    const p_brand = await brand_model_1.default.findOne({ _id: brand });
    if (!p_brand) {
        throw new appError_utils_1.default("Brand not found", 400);
    }
    product.category = p_category._id;
    product.brand = p_brand._id;
    //todo images
    //* cover image
    const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(cover_image[0], folder);
    product.cover_image = {
        path,
        public_id,
    };
    // * images
    if (images && Array.isArray(images) && images.length > 0) {
        const promises = images.map(async (file) => await (0, cloudinary_utils_1.sendFileToCloudinary)(file, folder));
        const files = await Promise.all(promises);
        product.image = files;
    }
    //! save product
    await product.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Product ${product._id} created`,
        statusCode: 201,
        data: product,
    });
});
//* update
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category, brand, new_arrival, featured, } = req.body;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product) {
        throw new appError_utils_1.default(`product ${id} not found`, 404);
    }
    const files = req.files;
    const cover_image = files?.cover_image;
    const images = files?.images;
    if (category) {
        const p_category = await category_model_1.default.findOne({ _id: category });
        if (!p_category) {
            throw new appError_utils_1.default("Category not found", 400);
        }
        product.category = p_category._id;
    }
    if (brand) {
        const p_brand = await brand_model_1.default.findOne({ _id: brand });
        if (!p_brand) {
            throw new appError_utils_1.default("Brand not found", 400);
        }
        product.brand = p_brand._id;
    }
    if (name)
        product.name = name;
    if (description)
        product.description = description;
    if (price)
        product.price = price;
    if (stock !== undefined)
        product.stock = stock;
    if (new_arrival !== undefined)
        product.new_arrival = new_arrival;
    if (featured !== undefined)
        product.featured = featured;
    if (cover_image && cover_image[0]) {
        if (product.cover_image?.public_id) {
            await (0, cloudinary_utils_1.deleteFileFromCloudinary)(product.cover_image.public_id);
        }
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(cover_image[0], folder);
        product.cover_image = {
            path,
            public_id,
        };
    }
    if (images && Array.isArray(images) && images.length > 0) {
        if (Array.isArray(product.image)) {
            await Promise.all(product.image.map((file) => file.public_id ? (0, cloudinary_utils_1.deleteFileFromCloudinary)(file.public_id) : null));
        }
        const promises = images.map(async (file) => await (0, cloudinary_utils_1.sendFileToCloudinary)(file, folder));
        product.image = await Promise.all(promises);
    }
    await product.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Product ${id} updated`,
        statusCode: 200,
        data: product,
    });
});
//* remove
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product) {
        throw new appError_utils_1.default(`product ${id} not found`, 404);
    }
    if (product.cover_image?.public_id) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(product.cover_image.public_id);
    }
    if (Array.isArray(product.image)) {
        await Promise.all(product.image.map((file) => file.public_id ? (0, cloudinary_utils_1.deleteFileFromCloudinary)(file.public_id) : null));
    }
    await product.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Product ${id} deleted`,
        statusCode: 200,
        data: product,
    });
});
//* get by category
exports.getByCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const products = await product_model_1.default.find({ category: id });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Product by category ${id} fetched`,
        statusCode: 200,
        data: products,
    });
});
//* get all featured products
exports.getFeaturedProducts = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_model_1.default.find({ featured: true });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `All featured Products fetched`,
        statusCode: 200,
        data: products,
    });
});
//* get all new arrivals
exports.getNewProducts = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_model_1.default.find({ new_arrival: true });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `All new arrivals  fetched`,
        statusCode: 200,
        data: products,
    });
});
