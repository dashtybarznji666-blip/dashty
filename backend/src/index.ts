import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './lib/env';
import { logger } from './lib/logger';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { swaggerSpec } from './config/swagger';
import shoeRoutes from './routes/shoe.routes';
import stockRoutes from './routes/stock.routes';
import saleRoutes from './routes/sale.routes';
import exchangeRateRoutes from './routes/exchange-rate.routes';
import expenseRoutes from './routes/expense.routes';
import uploadRoutes from './routes/upload.routes';
import supplierRoutes from './routes/supplier.routes';
import purchaseRoutes from './routes/purchase.routes';
import supplierPaymentRoutes from './routes/supplier-payment.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import activityLogRoutes from './routes/activity-log.routes';

const app = express();
const PORT = env.port;

// Security headers middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for Swagger UI
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for Swagger UI
      imgSrc: ["'self'", 'data:', 'https:'], // Allow images from any HTTPS source
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for Swagger UI compatibility
}));

// CORS configuration - allow requests from frontend
const isDevelopment = env.nodeEnv !== 'production';

// Enhanced CORS configuration with FRONTEND_URL validation
const corsOptions = {
  origin: isDevelopment 
    ? (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // Allow all localhost origins in development
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          callback(null, true);
        } else {
          // In development, allow all origins for easier testing
          callback(null, true);
        }
      }
    : (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // In production, validate against FRONTEND_URL
        const allowedOrigins = [env.frontendUrl];
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          return callback(null, true);
        }
        
        // Normalize origin (remove trailing slash)
        const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
        const normalizedFrontendUrl = env.frontendUrl.endsWith('/') ? env.frontendUrl.slice(0, -1) : env.frontendUrl;
        
        // Check if origin matches allowed origins (exact match required in production)
        if (normalizedOrigin === normalizedFrontendUrl) {
          callback(null, true);
        } else {
          logger.warn(`CORS: Blocked request from unauthorized origin: ${origin}`, {
            allowedOrigin: normalizedFrontendUrl,
            requestedOrigin: normalizedOrigin,
          });
          callback(new Error('Not allowed by CORS'));
        }
      },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests for all routes
app.options('*', cors(corsOptions));
app.use(express.json());

// Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Shoe Store API Documentation',
}));

// Swagger JSON endpoint
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check (public endpoint, no authentication required)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply rate limiting to all API routes (except docs and health)
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/docs') || req.path === '/health') {
    return next();
  }
  apiLimiter(req, res, next);
});

// Routes
app.use('/api/shoes', shoeRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/exchange-rate', exchangeRateRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/supplier-payments', supplierPaymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`, { 
    nodeEnv: env.nodeEnv,
    port: PORT 
  });
});

// Error handling for server
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack, port: PORT });
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection', { reason: reason?.message || reason, port: PORT });
  process.exit(1);
});


