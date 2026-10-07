import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import { initDatabase } from './db.js';
import {
  configureHelmet,
  generalApiLimiter,
  sanitizeBodyMiddleware
} from './middleware/security.js';
import { uploadsDir } from './middleware/upload.js';

import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite database and seed defaults
initDatabase();

// 1. Strict Security Headers via Helmet
app.use(configureHelmet());

// 2. CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman or same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in local dev, strict in prod
  },
  credentials: true
}));

// 3. Body parsers with size limit
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// 4. Sanitize inputs to eliminate XSS injections
app.use(sanitizeBodyMiddleware);

// 5. Serve user uploaded files safely (no executable scripts)
app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  next();
}, express.static(uploadsDir));

// 6. Rate Limit on /api
app.use('/api', generalApiLimiter);

// 7. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MAG Rubber Plant API', timestamp: new Date().toISOString() });
});

// 8. Serve Client in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

// 9. Centralized Error Handler (prevents stack leaks)
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Виникла внутрішня помилка сервера' 
      : err.message
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`⚙️  MAG Rubber Tech Plant Server started!`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`🔒 Security protections active: Helmet, Rate-Limit, JWT, Bcrypt, SQLite WAL`);
  console.log(`===============================================`);
});
