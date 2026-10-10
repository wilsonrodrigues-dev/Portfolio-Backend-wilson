"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestimonials = getTestimonials;
exports.createTestimonial = createTestimonial;
exports.getTestimonialById = getTestimonialById;
exports.updateTestimonial = updateTestimonial;
exports.deleteTestimonial = deleteTestimonial;
const Testimonial_1 = __importDefault(require("../models/Testimonial"));
const response_1 = require("../utils/response");
async function getTestimonials(req, res, next) {
    try {
        const filter = {};
        // Anonymous callers only ever see published testimonials (drafts are admin-only).
        if (req.query.public === 'true' || !req.user)
            filter.published = true;
        const testimonials = await Testimonial_1.default.find(filter).sort({ order: 1 }).select('-__v');
        (0, response_1.sendSuccess)(res, testimonials);
    }
    catch (error) {
        next(error);
    }
}
async function createTestimonial(req, res, next) {
    try {
        const t = await Testimonial_1.default.create(req.body);
        (0, response_1.sendSuccess)(res, t, 'Testimonial created', 201);
    }
    catch (error) {
        next(error);
    }
}
async function getTestimonialById(req, res, next) {
    try {
        const t = await Testimonial_1.default.findById(req.params.id);
        if (!t || (!req.user && !t.published)) {
            (0, response_1.sendError)(res, 'Testimonial not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, t);
    }
    catch (error) {
        next(error);
    }
}
async function updateTestimonial(req, res, next) {
    try {
        const t = await Testimonial_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!t) {
            (0, response_1.sendError)(res, 'Testimonial not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, t, 'Testimonial updated');
    }
    catch (error) {
        next(error);
    }
}
async function deleteTestimonial(req, res, next) {
    try {
        const t = await Testimonial_1.default.findByIdAndDelete(req.params.id);
        if (!t) {
            (0, response_1.sendError)(res, 'Testimonial not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, null, 'Testimonial deleted');
    }
    catch (error) {
        next(error);
    }
}
