import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { logAuditEvent } from '../middleware/security.js';

const router = express.Router();

// Allowed page keys
const VALID_PAGES = ['home', 'about', 'contacts'];

// GET /api/content/:page (Public)
router.get('/:page', (req, res) => {
  try {
    const { page } = req.params;
    if (!VALID_PAGES.includes(page)) {
      return res.status(404).json({ error: 'Розділ сайту не знайдено' });
    }

    const row = db.prepare('SELECT value FROM site_settings WHERE key = ?').get(page);
    if (!row) {
      return res.status(404).json({ error: 'Контент розділу не знайдено' });
    }

    res.json(JSON.parse(row.value));
  } catch (err) {
    console.error('Error fetching page content:', err);
    res.status(500).json({ error: 'Помилка сервера при отриманні вмісту' });
  }
});

// PUT /api/content/:page (Admin only)
router.put('/:page', requireAuth, (req, res) => {
  try {
    const { page } = req.params;
    if (!VALID_PAGES.includes(page)) {
      return res.status(400).json({ error: 'Недійсний розділ сайту' });
    }

    const contentData = req.body;
    if (!contentData || typeof contentData !== 'object') {
      return res.status(400).json({ error: 'Некоректні дані для збереження' });
    }

    const jsonString = JSON.stringify(contentData);

    const stmt = db.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(page, jsonString);

    logAuditEvent('UPDATE_CONTENT', { page, updatedBy: req.user.username }, req);

    res.json({
      success: true,
      message: `Розділ "${page}" успішно оновлено`,
      data: contentData
    });
  } catch (err) {
    console.error('Error saving content:', err);
    res.status(500).json({ error: 'Помилка при збереженні контенту' });
  }
});

export default router;
