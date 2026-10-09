"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExperiences = getExperiences;
exports.createExperience = createExperience;
exports.getExperienceById = getExperienceById;
exports.updateExperience = updateExperience;
exports.deleteExperience = deleteExperience;
const Experience_1 = __importDefault(require("../models/Experience"));
const response_1 = require("../utils/response");
async function getExperiences(req, res, next) {
    try {
        const filter = {};
        if (req.query.type)
            filter.type = req.query.type;
        const experiences = await Experience_1.default.find(filter).sort({ order: 1, startDate: -1 }).select('-__v');
        (0, response_1.sendSuccess)(res, experiences);
    }
    catch (error) {
        next(error);
    }
}
async function createExperience(req, res, next) {
    try {
        const exp = await Experience_1.default.create(req.body);
        (0, response_1.sendSuccess)(res, exp, 'Experience created', 201);
    }
    catch (error) {
        next(error);
    }
}
async function getExperienceById(req, res, next) {
    try {
        const exp = await Experience_1.default.findById(req.params.id);
        if (!exp) {
            (0, response_1.sendError)(res, 'Experience not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, exp);
    }
    catch (error) {
        next(error);
    }
}
async function updateExperience(req, res, next) {
    try {
        const exp = await Experience_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!exp) {
            (0, response_1.sendError)(res, 'Experience not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, exp, 'Experience updated');
    }
    catch (error) {
        next(error);
    }
}
async function deleteExperience(req, res, next) {
    try {
        const exp = await Experience_1.default.findByIdAndDelete(req.params.id);
        if (!exp) {
            (0, response_1.sendError)(res, 'Experience not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, null, 'Experience deleted');
    }
    catch (error) {
        next(error);
    }
}
