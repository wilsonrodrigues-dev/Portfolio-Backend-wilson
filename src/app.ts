import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Security middleware
app.use(helmet({
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
].filter((o): o is string => Boolean(o));

app.use(cors({
  origin: (origin, callback) => {
    // No Origin header (curl, server-to-server) → not browser-enforced, allow.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // No CORS headers are emitted → the browser blocks the response.
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Primary API routes
app.use('/api', routes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
  });
});

// Global error handling middleware
app.use(errorHandler);

export default app;
