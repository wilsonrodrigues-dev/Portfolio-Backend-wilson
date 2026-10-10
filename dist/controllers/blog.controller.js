"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicBlogs = getPublicBlogs;
exports.getPublicBlogBySlug = getPublicBlogBySlug;
exports.getAllBlogs = getAllBlogs;
exports.getBlogById = getBlogById;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
const Blog_1 = __importDefault(require("../models/Blog"));
const response_1 = require("../utils/response");
// Query params arrive via Express' extended query parser and can be objects
// (e.g. ?search[$ne]=x) — only plain strings are accepted as filter values.
function queryString(value) {
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}
// PUBLIC: Get all published blogs
async function getPublicBlogs(req, res, next) {
    try {
        const { page, limit, skip } = (0, response_1.getPaginationParams)(req.query);
        const category = queryString(req.query.category);
        const tag = queryString(req.query.tag);
        const search = queryString(req.query.search);
        const featured = req.query.featured;
        const filter = { status: 'published' };
        if (category)
            filter.category = category;
        if (tag)
            filter.tags = { $in: [tag] };
        if (featured === 'true')
            filter.featured = true;
        if (search) {
            const pattern = (0, response_1.escapeRegExp)(search);
            filter.$or = [
                { title: { $regex: pattern, $options: 'i' } },
                { excerpt: { $regex: pattern, $options: 'i' } },
                { tags: { $in: [new RegExp(pattern, 'i')] } },
            ];
        }
        const [blogs, total] = await Promise.all([
            Blog_1.default.find(filter)
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-content -__v'),
            Blog_1.default.countDocuments(filter),
        ]);
        (0, response_1.sendSuccess)(res, blogs, 'Blogs retrieved', 200, {
            page, limit, total, pages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        next(error);
    }
}
// PUBLIC: Get blog by slug
async function getPublicBlogBySlug(req, res, next) {
    try {
        const blog = await Blog_1.default.findOne({ slug: req.params.slug, status: 'published' }).select('-__v');
        if (!blog) {
            (0, response_1.sendError)(res, 'Blog post not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, blog);
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Get all blogs
async function getAllBlogs(req, res, next) {
    try {
        const { page, limit, skip } = (0, response_1.getPaginationParams)(req.query);
        const status = queryString(req.query.status);
        const search = queryString(req.query.search);
        const featured = req.query.featured;
        const filter = {};
        if (status)
            filter.status = status;
        if (featured !== undefined)
            filter.featured = featured === 'true';
        if (search) {
            const pattern = (0, response_1.escapeRegExp)(search);
            filter.$or = [
                { title: { $regex: pattern, $options: 'i' } },
                { excerpt: { $regex: pattern, $options: 'i' } },
            ];
        }
        const [blogs, total] = await Promise.all([
            Blog_1.default.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-content -__v'),
            Blog_1.default.countDocuments(filter),
        ]);
        (0, response_1.sendSuccess)(res, blogs, 'Blogs retrieved', 200, {
            page, limit, total, pages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Get blog by ID
async function getBlogById(req, res, next) {
    try {
        const blog = await Blog_1.default.findById(req.params.id).select('-__v');
        if (!blog) {
            (0, response_1.sendError)(res, 'Blog not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, blog);
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Create blog
async function createBlog(req, res, next) {
    try {
        const { title, slug: customSlug, ...rest } = req.body;
        if (!title) {
            (0, response_1.sendError)(res, 'Title is required.', 400);
            return;
        }
        const slug = customSlug || (0, response_1.generateSlug)(title);
        const existing = await Blog_1.default.findOne({ slug });
        if (existing) {
            (0, response_1.sendError)(res, `Slug "${slug}" is already in use.`, 409);
            return;
        }
        const blog = await Blog_1.default.create({ title, slug, ...rest });
        (0, response_1.sendSuccess)(res, blog, 'Blog post created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Update blog
async function updateBlog(req, res, next) {
    try {
        const blog = await Blog_1.default.findById(req.params.id);
        if (!blog) {
            (0, response_1.sendError)(res, 'Blog not found.', 404);
            return;
        }
        if (req.body.slug && req.body.slug !== blog.slug) {
            const existing = await Blog_1.default.findOne({ slug: req.body.slug });
            if (existing) {
                (0, response_1.sendError)(res, `Slug "${req.body.slug}" is already in use.`, 409);
                return;
            }
        }
        const updated = await Blog_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        }).select('-__v');
        (0, response_1.sendSuccess)(res, updated, 'Blog updated successfully');
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Delete blog
async function deleteBlog(req, res, next) {
    try {
        const blog = await Blog_1.default.findByIdAndDelete(req.params.id);
        if (!blog) {
            (0, response_1.sendError)(res, 'Blog not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, null, 'Blog deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
