import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import sanitizeHtml from 'sanitize-html';
import db from '../db.js';

// 1. Production Helmet configuration with strict headers
export const configureHelmet = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://images.unsplash.com",
          "https://unpkg.com",
          "https://*.tile.openstreetmap.org"
        ],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  });
};

// 2. Rate Limiter for Login (Anti-Brute Force Protection)
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 failed login attempts per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Забагато спроб входу. З міркувань безпеки ваш доступ тимчасово заблоковано на 15 хвилин.'
  }
});

// 3. Rate Limiter for Contact Form Submissions (Spam & Flood Prevention)
export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 messages per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Занадто багато повідомлень. Будь ласка, зачекайте перед повторним відправленням.'
  }
});

// 4. General API Rate Limiter (Anti-DoS Protection)
export const generalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 150, // 150 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Перевищено ліміт запитів до API.'
  }
});

// 5. Deep Sanitize Helper for input fields to prevent XSS attacks
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return sanitizeHtml(str, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    allowedAttributes: {
      'a': ['href', 'target', 'rel']
    },
    disallowedTagsMode: 'discard'
  }).trim();
};

// Middleware to recursively sanitize all strings in req.body
export const sanitizeBodyMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitizeObj = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObj(obj[key]);
        }
      }
    };
    sanitizeObj(req.body);
  }
  next();
};

// 6. Security Audit Logger
export const logAuditEvent = (action, details, req) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const stmt = db.prepare(`
      INSERT INTO audit_logs (action, details, ip_address, user_agent)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(action, typeof details === 'object' ? JSON.stringify(details) : details, String(ip), String(userAgent));
  } catch (err) {
    console.error('[Audit Logger Error]', err);
  }
};
