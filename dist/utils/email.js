"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.contactNotificationHtml = contactNotificationHtml;
const nodemailer_1 = __importDefault(require("nodemailer"));
function createTransporter() {
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}
async function sendEmail(options) {
    // Skip email in development if SMTP not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_PASS === 'your-app-password-here') {
        console.log(`📧 [Email Mock] To: ${options.to} | Subject: ${options.subject}`);
        return;
    }
    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Wilson Rodrigues'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        ...options,
    });
}
// Escapes user-supplied values before they are interpolated into the HTML
// notification (prevents HTML injection into the email body).
function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function contactNotificationHtml(data) {
    const name = escapeHtml(data.name);
    const email = escapeHtml(data.email);
    const subject = escapeHtml(data.subject);
    const message = escapeHtml(data.message).replace(/\n/g, '<br>');
    const phone = data.phone ? escapeHtml(data.phone) : '';
    const projectType = data.projectType ? escapeHtml(data.projectType) : '';
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif; background: #0f0f11; color: #e8e4d9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
        .header { border-bottom: 1px solid rgba(232,228,217,0.08); padding-bottom: 24px; margin-bottom: 24px; }
        .header h1 { font-size: 24px; font-weight: 700; margin: 0; color: #e8e4d9; }
        .header p { font-size: 14px; color: rgba(232,228,217,0.6); margin: 8px 0 0; }
        .field { margin-bottom: 16px; }
        .field label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #c8b89a; display: block; margin-bottom: 4px; }
        .field p { font-size: 15px; color: #e8e4d9; margin: 0; line-height: 1.6; background: #141416; padding: 12px 16px; border-radius: 4px; border: 1px solid rgba(232,228,217,0.08); }
        .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(232,228,217,0.08); font-size: 13px; color: rgba(232,228,217,0.4); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Portfolio Inquiry</h1>
          <p>Someone reached out through your portfolio contact form.</p>
        </div>
        <div class="field"><label>Name</label><p>${name}</p></div>
        <div class="field"><label>Email</label><p>${email}</p></div>
        ${phone ? `<div class="field"><label>Phone</label><p>${phone}</p></div>` : ''}
        ${projectType ? `<div class="field"><label>Project Type</label><p>${projectType}</p></div>` : ''}
        <div class="field"><label>Subject</label><p>${subject}</p></div>
        <div class="field"><label>Message</label><p>${message}</p></div>
        <div class="footer">Wilson Rodrigues Portfolio CMS — Automated notification</div>
      </div>
    </body>
    </html>
  `;
}
