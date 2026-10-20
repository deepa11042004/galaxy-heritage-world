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

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  config.corsOrigin,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'https://galaxyheritageworld.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin like curl or mobile apps
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.galaxyheritageworld.com')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/staging
      }
    },
    credentials: true,
  })
);

// Body parsers & cookies
app.use(cookieParser(config.cookie.secret));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static media serving
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
