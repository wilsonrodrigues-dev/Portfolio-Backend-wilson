import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import { sendSuccess, sendError, getPaginationParams } from '../utils/response';
import { sendEmail, contactNotificationHtml } from '../utils/email';

// PUBLIC: Submit contact form
export async function submitContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, subject, message, phone, projectType } = req.body;

    // All core fields must be non-empty strings (blocks object/array payloads
    // that would otherwise crash .trim()/.toLowerCase() and cause a 500).
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string' ||
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      sendError(res, 'Name, email, subject and message are required.', 400);
      return;
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      sendError(res, 'Invalid email address.', 400);
      return;
    }

    const phoneStr = typeof phone === 'string' && phone.trim() ? phone.trim() : undefined;
    const projectTypeStr = typeof projectType === 'string' && projectType.trim() ? projectType.trim() : undefined;
    // CRLF must never reach an email header (header-injection guard).
    const subjectForEmail = subject.replace(/[\r\n]+/g, ' ').trim();

    // Save to DB
    const msg = await Message.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      phone: phoneStr,
      projectType: projectTypeStr,
      ipAddress: req.ip,
    });

    // Send email notification (non-blocking)
    sendEmail({
      to: process.env.CONTACT_EMAIL_TO || 'wilsonrodrigues.dev20@gmail.com',
      subject: `New Portfolio Inquiry: ${subjectForEmail}`,
      html: contactNotificationHtml({ name, email, subject, message, phone: phoneStr, projectType: projectTypeStr }),
      text: `New inquiry from ${name} (${email})\n\nSubject: ${subject}\n\nMessage: ${message}`,
    }).catch((err) => console.error('Email send failed:', err));

    sendSuccess(
      res,
      { id: msg._id },
      "Your message has been sent! I'll get back to you soon.",
      201
    );
  } catch (error) {
    next(error);
  }
}

// ADMIN: Get all messages
export async function getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query as Record<string, string>);
    const { read, starred } = req.query;

    const filter: Record<string, unknown> = {};
    if (read !== undefined) filter.read = read === 'true';
    if (starred !== undefined) filter.starred = starred === 'true';

    const [messages, total, unread] = await Promise.all([
      Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Message.countDocuments(filter),
      Message.countDocuments({ read: false }),
    ]);

    sendSuccess(res, messages, 'Messages retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit), unread,
    });
  } catch (error) {
    next(error);
  }
}

// ADMIN: Get message by ID
export async function getMessageById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const message = await Message.findById(req.params.id).select('+ipAddress');
    if (!message) {
      sendError(res, 'Message not found.', 404);
      return;
    }
    // Auto-mark as read
    if (!message.read) {
      message.read = true;
      await message.save();
    }
    sendSuccess(res, message);
  } catch (error) {
    next(error);
  }
}

// ADMIN: Update message (mark read/starred/replied)
export async function updateMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { read, starred, replied } = req.body;
    const update: Record<string, unknown> = {};
    if (typeof read === 'boolean') update.read = read;
    if (typeof starred === 'boolean') update.starred = starred;
    if (typeof replied === 'boolean') update.replied = replied;

    const message = await Message.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!message) {
      sendError(res, 'Message not found.', 404);
      return;
    }
    sendSuccess(res, message, 'Message updated');
  } catch (error) {
    next(error);
  }
}

// ADMIN: Delete message
export async function deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      sendError(res, 'Message not found.', 404);
      return;
    }
    sendSuccess(res, null, 'Message deleted');
  } catch (error) {
    next(error);
  }
}
