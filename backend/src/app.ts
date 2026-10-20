import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { swaggerDocument } from './config/swagger.js';
import { errorHandler, AppError } from './middlewares/error.js';

export const app = express();

// Behind Coolify/nginx the client IP comes from X-Forwarded-For (needed for rate limiting & audit logs).
if (config.env === 'production') app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration: credentialed requests are only accepted from known origins.
const allowedOrigins = new Set(
  [
    ...config.corsOrigin.split(',').map((o) => o.trim()),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://galaxyheritageworld.com',
    'https://www.galaxyheritageworld.com',
  ].filter(Boolean)
);

app.use(
  cors({
    origin: (origin, callback) => {
      // no Origin header: curl, server-side rendering, health checks
      if (!origin || allowedOrigins.has(origin)) callback(null, true);
      else callback(null, false);
    },
    credentials: true,
  })
);

// Body parsers & cookies
app.use(cookieParser(config.cookie.secret));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static media serving (images are embedded cross-origin by the website and the admin panel)
app.use('/media', (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
const localMedia = path.resolve(process.cwd(), 'public/media');
app.use('/media', express.static(localMedia));

const frontendMedia = path.resolve(process.cwd(), '../frontend/public/media');
app.use('/media', express.static(frontendMedia));

// Swagger API Documentation
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/v1/docs/json', (_req: Request, res: Response) => {
  res.json(swaggerDocument);
});

// Root API Status Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Galaxy Heritage World API',
    version: '1.0.0',
    status: 'UP',
    documentation: '/api/v1/docs',
    health: '/api/v1/health',
  });
});

// API Routes
app.use('/api/v1', apiRouter);

// 404 Handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Route not found`, 404));
});

// Centralized Error Handling
app.use(errorHandler);
