"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/public', blog_controller_1.getPublicBlogs);
router.get('/public/:slug', blog_controller_1.getPublicBlogBySlug);
// Admin routes (protected)
router.use(auth_1.protect);
router.get('/', blog_controller_1.getAllBlogs);
router.post('/', blog_controller_1.createBlog);
router.get('/:id', blog_controller_1.getBlogById);
router.put('/:id', blog_controller_1.updateBlog);
router.delete('/:id', blog_controller_1.deleteBlog);
exports.default = router;
