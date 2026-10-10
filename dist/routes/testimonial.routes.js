"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testimonial_controller_1 = require("../controllers/testimonial.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public: GET /api/testimonials?public=true
router.get('/', auth_1.optionalAuth, testimonial_controller_1.getTestimonials);
router.get('/:id', auth_1.optionalAuth, testimonial_controller_1.getTestimonialById);
// Admin protected routes
router.use(auth_1.protect);
router.post('/', testimonial_controller_1.createTestimonial);
router.put('/:id', testimonial_controller_1.updateTestimonial);
router.delete('/:id', testimonial_controller_1.deleteTestimonial);
exports.default = router;
