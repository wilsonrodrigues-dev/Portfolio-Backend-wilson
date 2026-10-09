"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact.controller");
const auth_1 = require("../middleware/auth");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
// Rate limiter for contact submission: max 5 messages per 15 mins per IP
const contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Too many message submissions. Please try again later.' },
});
// PUBLIC ROUTE
router.post('/', contactLimiter, contact_controller_1.submitContact);
// ADMIN ROUTES (PROTECTED)
router.use(auth_1.protect);
router.get('/', contact_controller_1.getMessages);
router.get('/:id', contact_controller_1.getMessageById);
router.patch('/:id', contact_controller_1.updateMessage);
router.delete('/:id', contact_controller_1.deleteMessage);
exports.default = router;
