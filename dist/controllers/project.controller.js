"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicProjects = getPublicProjects;
exports.getPublicProjectBySlug = getPublicProjectBySlug;
exports.getAllProjects = getAllProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
const Project_1 = __importDefault(require("../models/Project"));
const response_1 = require("../utils/response");
// PUBLIC: Get all published projects
async function getPublicProjects(req, res, next) {
    try {
        const { category, featured } = req.query;
        const filter = { published: true };
        if (category)
            filter.category = category;
        if (featured === 'true')
            filter.featured = true;
        const projects = await Project_1.default.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .select('-__v');
        (0, response_1.sendSuccess)(res, projects);
    }
    catch (error) {
        next(error);
    }
}
// PUBLIC: Get project by slug
async function getPublicProjectBySlug(req, res, next) {
    try {
        const project = await Project_1.default.findOne({ slug: req.params.slug, published: true }).select('-__v');
        if (!project) {
            (0, response_1.sendError)(res, 'Project not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, project);
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Get all projects (including drafts)
async function getAllProjects(req, res, next) {
    try {
        const { page, limit, skip } = (0, response_1.getPaginationParams)(req.query);
        const { search, published, featured, category } = req.query;
        const filter = {};
        if (published !== undefined)
            filter.published = published === 'true';
        if (featured !== undefined)
            filter.featured = featured === 'true';
        if (category)
            filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { shortDescription: { $regex: search, $options: 'i' } },
            ];
        }
        const [projects, total] = await Promise.all([
            Project_1.default.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).select('-__v'),
            Project_1.default.countDocuments(filter),
        ]);
        (0, response_1.sendSuccess)(res, projects, 'Projects retrieved', 200, {
            page, limit, total, pages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Get project by ID
async function getProjectById(req, res, next) {
    try {
        const project = await Project_1.default.findById(req.params.id).select('-__v');
        if (!project) {
            (0, response_1.sendError)(res, 'Project not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, project);
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Create project
async function createProject(req, res, next) {
    try {
        const { title, slug: customSlug, ...rest } = req.body;
        if (!title) {
            (0, response_1.sendError)(res, 'Title is required.', 400);
            return;
        }
        const slug = customSlug || (0, response_1.generateSlug)(title);
        // Check slug uniqueness
        const existing = await Project_1.default.findOne({ slug });
        if (existing) {
            (0, response_1.sendError)(res, `Slug "${slug}" is already in use.`, 409);
            return;
        }
        const project = await Project_1.default.create({ title, slug, ...rest });
        (0, response_1.sendSuccess)(res, project, 'Project created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Update project
async function updateProject(req, res, next) {
    try {
        const project = await Project_1.default.findById(req.params.id);
        if (!project) {
            (0, response_1.sendError)(res, 'Project not found.', 404);
            return;
        }
        // If slug is being changed, check uniqueness
        if (req.body.slug && req.body.slug !== project.slug) {
            const existing = await Project_1.default.findOne({ slug: req.body.slug });
            if (existing) {
                (0, response_1.sendError)(res, `Slug "${req.body.slug}" is already in use.`, 409);
                return;
            }
        }
        const updated = await Project_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).select('-__v');
        (0, response_1.sendSuccess)(res, updated, 'Project updated successfully');
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Delete project
async function deleteProject(req, res, next) {
    try {
        const project = await Project_1.default.findByIdAndDelete(req.params.id);
        if (!project) {
            (0, response_1.sendError)(res, 'Project not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, null, 'Project deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
