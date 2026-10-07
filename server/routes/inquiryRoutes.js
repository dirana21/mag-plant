import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { contactRateLimiter, logAuditEvent } from '../middleware/security.js';

const router = express.Router();

// POST /api/inquiries (Public with rate limiting)
router.post('/', contactRateLimiter, (req, res) => {
  try {
    const { name, phone, email, company, product_name, message } = req.body;

    if (!name || !name.trim() || !phone || !phone.trim()) {
      return res.status(400).json({ error: 'Будь ласка, вкажіть ваше ім\'я та контактний номер телефону' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    const stmt = db.prepare(`
      INSERT INTO inquiries (name, phone, email, company, product_name, message, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      phone.trim(),
      (email || '').trim(),
      (company || '').trim(),
      (product_name || '').trim(),
      (message || '').trim(),
      String(ip)
    );

    res.status(201).json({
      success: true,
      message: 'Дякуємо! Ваша заявка прийнята. Менеджер комерційного відділу MAG зв\'яжеться з вами найближчим часом.',
      id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    res.status(500).json({ error: 'Помилка при відправці заявки. Спробуйте зателефонувати нам напряму.' });
  }
});

// GET /api/inquiries (Admin only)
router.get('/', requireAuth, (req, res) => {
  try {
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY id DESC').all();
    res.json(inquiries);
  } catch (err) {
    console.error('Error listing inquiries:', err);
    res.status(500).json({ error: 'Помилка при завантаженні заявок' });
  }
});

// PATCH /api/inquiries/:id (Admin only - update status)
router.patch('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Недійсний статус заявки' });
    }

    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true, message: 'Статус заявки оновлено' });
  } catch (err) {
    console.error('Error updating inquiry status:', err);
    res.status(500).json({ error: 'Помилка оновлення статусу' });
  }
});

// DELETE /api/inquiries/:id (Admin only)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM inquiries WHERE id = ?').run(id);
    logAuditEvent('DELETE_INQUIRY', { inquiryId: id }, req);
    res.json({ success: true, message: 'Заявку видалено' });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    res.status(500).json({ error: 'Помилка при видаленні заявки' });
  }
});

export default router;
