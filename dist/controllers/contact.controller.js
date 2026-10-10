"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContact = submitContact;
exports.getMessages = getMessages;
exports.getMessageById = getMessageById;
exports.updateMessage = updateMessage;
exports.deleteMessage = deleteMessage;
const Message_1 = __importDefault(require("../models/Message"));
const response_1 = require("../utils/response");
const email_1 = require("../utils/email");
// PUBLIC: Submit contact form
async function submitContact(req, res, next) {
    try {
        const { name, email, subject, message, phone, projectType } = req.body;
        // All core fields must be non-empty strings (blocks object/array payloads
        // that would otherwise crash .trim()/.toLowerCase() and cause a 500).
        if (typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof subject !== 'string' ||
            typeof message !== 'string' ||
            !name ||
            !email ||
            !subject ||
            !message) {
            (0, response_1.sendError)(res, 'Name, email, subject and message are required.', 400);
            return;
        }
        // Email format validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            (0, response_1.sendError)(res, 'Invalid email address.', 400);
            return;
        }
        const phoneStr = typeof phone === 'string' && phone.trim() ? phone.trim() : undefined;
        const projectTypeStr = typeof projectType === 'string' && projectType.trim() ? projectType.trim() : undefined;
        // CRLF must never reach an email header (header-injection guard).
        const subjectForEmail = subject.replace(/[\r\n]+/g, ' ').trim();
        // Save to DB
        const msg = await Message_1.default.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            subject: subject.trim(),
            message: message.trim(),
            phone: phoneStr,
            projectType: projectTypeStr,
            ipAddress: req.ip,
        });
        // Send email notification (non-blocking)
        (0, email_1.sendEmail)({
            to: process.env.CONTACT_EMAIL_TO || 'wilsonrodrigues.dev20@gmail.com',
            subject: `New Portfolio Inquiry: ${subjectForEmail}`,
            html: (0, email_1.contactNotificationHtml)({ name, email, subject, message, phone: phoneStr, projectType: projectTypeStr }),
            text: `New inquiry from ${name} (${email})\n\nSubject: ${subject}\n\nMessage: ${message}`,
        }).catch((err) => console.error('Email send failed:', err));
        (0, response_1.sendSuccess)(res, { id: msg._id }, "Your message has been sent! I'll get back to you soon.", 201);
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Get all messages
async function getMessages(req, res, next) {
    try {
        const { page, limit, skip } = (0, response_1.getPaginationParams)(req.query);
        const { read, starred } = req.query;
        const filter = {};
        if (read !== undefined)
            filter.read = read === 'true';
        if (starred !== undefined)
            filter.starred = starred === 'true';
        const [messages, total, unread] = await Promise.all([
            Message_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Message_1.default.countDocuments(filter),
            Message_1.default.countDocuments({ read: false }),
        ]);
        (0, response_1.sendSuccess)(res, messages, 'Messages retrieved', 200, {
            page, limit, total, pages: Math.ceil(total / limit), unread,
        });
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Get message by ID
async function getMessageById(req, res, next) {
    try {
        const message = await Message_1.default.findById(req.params.id).select('+ipAddress');
        if (!message) {
            (0, response_1.sendError)(res, 'Message not found.', 404);
            return;
        }
        // Auto-mark as read
        if (!message.read) {
            message.read = true;
            await message.save();
        }
        (0, response_1.sendSuccess)(res, message);
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Update message (mark read/starred/replied)
async function updateMessage(req, res, next) {
    try {
        const { read, starred, replied } = req.body;
        const update = {};
        if (typeof read === 'boolean')
            update.read = read;
        if (typeof starred === 'boolean')
            update.starred = starred;
        if (typeof replied === 'boolean')
            update.replied = replied;
        const message = await Message_1.default.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!message) {
            (0, response_1.sendError)(res, 'Message not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, message, 'Message updated');
    }
    catch (error) {
        next(error);
    }
}
// ADMIN: Delete message
async function deleteMessage(req, res, next) {
    try {
        const message = await Message_1.default.findByIdAndDelete(req.params.id);
        if (!message) {
            (0, response_1.sendError)(res, 'Message not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, null, 'Message deleted');
    }
    catch (error) {
        next(error);
    }
}
