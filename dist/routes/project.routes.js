"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/public', project_controller_1.getPublicProjects);
router.get('/public/:slug', project_controller_1.getPublicProjectBySlug);
// Admin routes (protected)
router.use(auth_1.protect);
router.get('/', project_controller_1.getAllProjects);
router.post('/', project_controller_1.createProject);
router.get('/:id', project_controller_1.getProjectById);
router.put('/:id', project_controller_1.updateProject);
router.delete('/:id', project_controller_1.deleteProject);
exports.default = router;
