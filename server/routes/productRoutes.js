import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { logAuditEvent } from '../middleware/security.js';

const router = express.Router();

// Transliterate Ukrainian to URL-safe slug
function generateSlug(text) {
  const uaMap = {
    'а':'a', 'б':'b', 'в':'v', 'г':'h', 'ґ':'g', 'д':'d', 'е':'e', 'є':'ye',
    'ж':'zh', 'з':'z', 'и':'y', 'і':'i', 'ї':'yi', 'й':'y', 'к':'k', 'л':'l',
    'м':'m', 'н':'n', 'о':'o', 'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u',
    'ф':'f', 'х':'kh', 'ц':'ts', 'ч':'ch', 'ш':'sh', 'щ':'shch', 'ь':'',
    'ю':'yu', 'я':'ya'
  };

  let slug = text.toLowerCase();
  for (const [key, val] of Object.entries(uaMap)) {
    slug = slug.split(key).join(val);
  }

  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return slug || 'product-' + Date.now();
}

// Format product row (parse JSON fields)
function formatProduct(row) {
  if (!row) return null;
  return {
    ...row,
    gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery || '[]') : (row.gallery || []),
    specs: typeof row.specs === 'string' ? JSON.parse(row.specs || '[]') : (row.specs || []),
    is_featured: Boolean(row.is_featured)
  };
}

// GET /api/products (Public)
router.get('/', (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'Всі') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured === '1' || featured === 'true') {
      query += ' AND is_featured = 1';
    }

    if (search && search.trim()) {
      query += ' AND (name LIKE ? OR short_desc LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY sort_order ASC, id DESC';

    const products = db.prepare(query).all(...params);
    res.json(products.map(formatProduct));
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Помилка при завантаженні товарів' });
  }
});

// GET /api/products/:slugOrId (Public)
router.get('/:slugOrId', (req, res) => {
  try {
    const { slugOrId } = req.params;
    let product;

    if (/^\d+$/.test(slugOrId)) {
      product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(slugOrId));
    } else {
      product = db.prepare('SELECT * FROM products WHERE slug = ?').get(slugOrId);
    }

    if (!product) {
      return res.status(404).json({ error: 'Товар не знайдено' });
    }

    res.json(formatProduct(product));
  } catch (err) {
    console.error('Error fetching single product:', err);
    res.status(500).json({ error: 'Помилка при завантаженні інформації про товар' });
  }
});

// POST /api/products (Admin only)
router.post('/', requireAuth, (req, res) => {
  try {
    const {
      name,
      category,
      image,
      gallery,
      short_desc,
      description,
      specs,
      is_featured,
      sort_order
    } = req.body;

    if (!name || !category || !image || !short_desc) {
      return res.status(400).json({ error: 'Заповніть обов\'язкові поля (Назва, Категорія, Головне фото, Короткий опис)' });
    }

    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;
    while (db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const stmt = db.prepare(`
      INSERT INTO products (
        slug, name, category, image, gallery, short_desc, description, specs, is_featured, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      slug,
      name.trim(),
      category.trim(),
      image.trim(),
      JSON.stringify(Array.isArray(gallery) ? gallery : []),
      short_desc.trim(),
      (description || '').trim(),
      JSON.stringify(Array.isArray(specs) ? specs : []),
      is_featured ? 1 : 0,
      Number(sort_order) || 0
    );

    logAuditEvent('CREATE_PRODUCT', { productId: result.lastInsertRowid, name }, req);

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(formatProduct(created));
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Помилка при створенні товару' });
  }
});

// PUT /api/products/:id (Admin only)
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Товар для оновлення не знайдено' });
    }

    const {
      name,
      category,
      image,
      gallery,
      short_desc,
      description,
      specs,
      is_featured,
      sort_order
    } = req.body;

    const stmt = db.prepare(`
      UPDATE products SET
        name = ?,
        category = ?,
        image = ?,
        gallery = ?,
        short_desc = ?,
        description = ?,
        specs = ?,
        is_featured = ?,
        sort_order = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      (name || existing.name).trim(),
      (category || existing.category).trim(),
      (image || existing.image).trim(),
      JSON.stringify(gallery !== undefined ? gallery : JSON.parse(existing.gallery || '[]')),
      (short_desc || existing.short_desc).trim(),
      (description !== undefined ? description : existing.description).trim(),
      JSON.stringify(specs !== undefined ? specs : JSON.parse(existing.specs || '[]')),
      is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
      sort_order !== undefined ? Number(sort_order) : existing.sort_order,
      id
    );

    logAuditEvent('UPDATE_PRODUCT', { productId: id, name: name || existing.name }, req);

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(formatProduct(updated));
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Помилка при оновленні товару' });
  }
});

// DELETE /api/products/:id (Admin only)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id, name FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Товар не знайдено' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    logAuditEvent('DELETE_PRODUCT', { productId: id, name: existing.name }, req);

    res.json({ success: true, message: `Товар "${existing.name}" успішно видалено` });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Помилка при видаленні товару' });
  }
});

export default router;
