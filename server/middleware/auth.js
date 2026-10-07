import jwt from 'jsonwebtoken';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mag_secure_jwt_secret_salt_3901928491823719';

export const requireAuth = (req, res, next) => {
  try {
    // 1. Look in cookie first (httpOnly), then Bearer token header
    let token = req.cookies?.mag_admin_token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Потрібна авторизація для доступу до панелі керування' });
    }

    // 2. Verify token signature and expiration
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Verify user still exists in database
    const user = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Користувача не знайдено або доступ відкликано' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Сесія завершилася. Будь ласка, увійдіть знову.' });
    }
    return res.status(401).json({ error: 'Недійсний токен безпеки' });
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
