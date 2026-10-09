"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbout = getAbout;
exports.updateAbout = updateAbout;
const About_1 = __importDefault(require("../models/About"));
const response_1 = require("../utils/response");
async function getAbout(req, res, next) {
    try {
        let about = await About_1.default.findOne().select('-__v');
        if (!about) {
            (0, response_1.sendSuccess)(res, null, 'About not configured yet');
            return;
        }
        (0, response_1.sendSuccess)(res, about);
    }
    catch (error) {
        next(error);
    }
}
async function updateAbout(req, res, next) {
    try {
        let about = await About_1.default.findOne();
        if (!about) {
            about = await About_1.default.create(req.body);
        }
        else {
            about = await About_1.default.findByIdAndUpdate(about._id, req.body, { new: true, runValidators: true });
        }
        (0, response_1.sendSuccess)(res, about, 'About updated successfully');
    }
    catch (error) {
        next(error);
    }
}
