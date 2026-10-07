import express from 'express';
import { upload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';
import { logAuditEvent } from '../middleware/security.js';

const router = express.Router();

// POST /api/upload (Admin only)
router.post('/', requireAuth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Помилка при завантаженні файлу' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Будь ласка, оберіть файл для завантаження' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    logAuditEvent('FILE_UPLOAD', { filename: req.file.filename, size: req.file.size }, req);

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  });
});

export default router;
