"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServices = getServices;
exports.createService = createService;
exports.getServiceById = getServiceById;
exports.updateService = updateService;
exports.deleteService = deleteService;
const Service_1 = __importDefault(require("../models/Service"));
const response_1 = require("../utils/response");
async function getServices(req, res, next) {
    try {
        const filter = {};
        // Anonymous callers only ever see visible services (drafts are admin-only).
        if (req.query.public === 'true' || !req.user)
            filter.visible = true;
        const services = await Service_1.default.find(filter).sort({ order: 1 }).select('-__v');
        (0, response_1.sendSuccess)(res, services);
    }
    catch (error) {
        next(error);
    }
}
async function createService(req, res, next) {
    try {
        const service = await Service_1.default.create(req.body);
        (0, response_1.sendSuccess)(res, service, 'Service created', 201);
    }
    catch (error) {
        next(error);
    }
}
async function getServiceById(req, res, next) {
    try {
        const service = await Service_1.default.findById(req.params.id);
        if (!service || (!req.user && !service.visible)) {
            (0, response_1.sendError)(res, 'Service not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, service);
    }
    catch (error) {
        next(error);
    }
}
async function updateService(req, res, next) {
    try {
        const service = await Service_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!service) {
            (0, response_1.sendError)(res, 'Service not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, service, 'Service updated');
    }
    catch (error) {
        next(error);
    }
}
async function deleteService(req, res, next) {
    try {
        const service = await Service_1.default.findByIdAndDelete(req.params.id);
        if (!service) {
            (0, response_1.sendError)(res, 'Service not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, null, 'Service deleted');
    }
    catch (error) {
        next(error);
    }
}
