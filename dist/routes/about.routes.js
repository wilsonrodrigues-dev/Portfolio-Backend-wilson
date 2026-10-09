"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const about_controller_1 = require("../controllers/about.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', about_controller_1.getAbout);
router.put('/', auth_1.protect, about_controller_1.updateAbout);
exports.default = router;
