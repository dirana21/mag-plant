import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { generateToken, requireAuth } from '../middleware/auth.js';
import { loginRateLimiter, logAuditEvent } from '../middleware/security.js';

const router = express.Router();

// POST /api/auth/login (with brute-force rate limiter)
router.post('/login', loginRateLimiter, (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Введіть ім\'я користувача та пароль' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim());
    if (!user) {
      logAuditEvent('FAILED_LOGIN', { username, reason: 'User not found' }, req);
      return res.status(401).json({ error: 'Невірний логін або пароль' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      logAuditEvent('FAILED_LOGIN', { username, reason: 'Invalid password' }, req);
      return res.status(401).json({ error: 'Невірний логін або пароль' });
    }

    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    const token = generateToken(user);

    // Set secure HTTP-only cookie
    res.cookie('mag_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    logAuditEvent('SUCCESSFUL_LOGIN', { username: user.username }, req);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Помилка сервера при авторизації' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('mag_admin_token');
  res.json({ success: true, message: 'Ви успішно вийшли з системи' });
});

// GET /api/auth/me (Check current session)
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// POST /api/auth/update-credentials (Change admin credentials)
router.post('/update-credentials', requireAuth, (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    // Verify current password
    if (!currentPassword || !bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(400).json({ error: 'Поточний пароль введено невірно' });
    }

    let updatedUsername = user.username;
    if (newUsername && newUsername.trim().length >= 3) {
      updatedUsername = newUsername.trim();
    }

    let updatedHash = user.password_hash;
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Новий пароль повинен містити щонайменше 6 символів' });
      }
      const salt = bcrypt.genSaltSync(12);
      updatedHash = bcrypt.hashSync(newPassword, salt);
    }

    db.prepare(`
      UPDATE users 
      SET username = ?, password_hash = ?
      WHERE id = ?
    `).run(updatedUsername, updatedHash, user.id);

    logAuditEvent('CREDENTIALS_UPDATED', { username: updatedUsername }, req);

    res.json({
      success: true,
      message: 'Облікові дані успішно оновлено',
      user: { id: user.id, username: updatedUsername, role: user.role }
    });
  } catch (err) {
    console.error('Update credentials error:', err);
    res.status(500).json({ error: 'Помилка при оновленні облікових даних' });
  }
});

// GET /api/auth/audit-logs (Security logs for admin)
router.get('/audit-logs', requireAuth, (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50').all();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Помилка завантаження журналів безпеки' });
  }
});

export default router;
