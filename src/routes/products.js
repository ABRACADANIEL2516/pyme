import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create product { name, price }
router.post('/', async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price == null) return res.status(400).json({ error: 'name & price required' });

    const [result] = await pool.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price]);
    const [productRows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(productRows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
