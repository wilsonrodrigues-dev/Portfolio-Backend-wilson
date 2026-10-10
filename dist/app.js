"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// Trust the first proxy hop (Render puts the app behind a load-balancer).
// Only enable when running behind a known trusted proxy.
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
// CORS configuration: explicit allowlist (env-configurable + local dev/preview).
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    // Vercel preview deployments follow *.vercel.app pattern — add your specific URL
    // in CLIENT_URL env var.
    'http://localhost:5173',
    'http://localhost:5174', // Vite fallback port when 5173 is busy
    'http://localhost:4173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:4173',
    'http://127.0.0.1:3000',
].filter((o) => Boolean(o));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // No Origin header (curl, server-to-server) → not browser-enforced, allow.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            // No CORS headers are emitted → the browser blocks the response.
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// Request parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('dev'));
}
// Serve uploaded files statically
const uploadsDir = path_1.default.join(__dirname, '../uploads');
app.use('/uploads', express_1.default.static(uploadsDir));
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
    });
});
// Primary API routes
app.use('/api', routes_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found.',
    });
});
// Global error handling middleware
app.use(errorHandler_1.errorHandler);
exports.default = app;
