"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_controller_1 = require("../controllers/service.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public: GET /api/services?public=true
router.get('/', auth_1.optionalAuth, service_controller_1.getServices);
router.get('/:id', auth_1.optionalAuth, service_controller_1.getServiceById);
// Admin protected routes
router.use(auth_1.protect);
router.post('/', service_controller_1.createService);
router.put('/:id', service_controller_1.updateService);
router.delete('/:id', service_controller_1.deleteService);
exports.default = router;
