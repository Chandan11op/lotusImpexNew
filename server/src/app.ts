import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Permit in dev for flexibility
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: [config.clientUrl, 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body and cookie parsing
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));
  app.use(cookieParser(config.cookieSecret));

  // Request logger for API calls in development
  if (config.nodeEnv !== 'test') {
    app.use((req, _res, next) => {
      console.log(`[API ${req.method}] ${req.url}`);
      next();
    });
  }

  // Mount API routes (supports both /api and /api/v1)
  app.use('/api', apiRouter);
  app.use('/api/v1', apiRouter);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
