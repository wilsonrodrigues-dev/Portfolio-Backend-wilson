"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkills = getSkills;
exports.createSkill = createSkill;
exports.getSkillById = getSkillById;
exports.updateSkill = updateSkill;
exports.deleteSkill = deleteSkill;
const Skill_1 = __importDefault(require("../models/Skill"));
const response_1 = require("../utils/response");
async function getSkills(req, res, next) {
    try {
        const filter = {};
        if (req.query.category)
            filter.category = req.query.category;
        if (req.query.public === 'true')
            filter.visible = true;
        const skills = await Skill_1.default.find(filter).sort({ category: 1, order: 1 }).select('-__v');
        (0, response_1.sendSuccess)(res, skills);
    }
    catch (error) {
        next(error);
    }
}
async function createSkill(req, res, next) {
    try {
        const skill = await Skill_1.default.create(req.body);
        (0, response_1.sendSuccess)(res, skill, 'Skill created', 201);
    }
    catch (error) {
        next(error);
    }
}
async function getSkillById(req, res, next) {
    try {
        const skill = await Skill_1.default.findById(req.params.id);
        if (!skill) {
            (0, response_1.sendError)(res, 'Skill not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, skill);
    }
    catch (error) {
        next(error);
    }
}
async function updateSkill(req, res, next) {
    try {
        const skill = await Skill_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!skill) {
            (0, response_1.sendError)(res, 'Skill not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, skill, 'Skill updated');
    }
    catch (error) {
        next(error);
    }
}
async function deleteSkill(req, res, next) {
    try {
        const skill = await Skill_1.default.findByIdAndDelete(req.params.id);
        if (!skill) {
            (0, response_1.sendError)(res, 'Skill not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, null, 'Skill deleted');
    }
    catch (error) {
        next(error);
    }
}
