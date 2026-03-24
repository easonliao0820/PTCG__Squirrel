import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/tags: Fetch all unique tags
router.get('/tags', async (req, res) => {
  try {
    const result = await pool.query('SELECT title FROM tag ORDER BY title ASC');
    const tags = result.rows.map(row => row.title);
    res.json(tags);
  } catch (err) {
    console.error('Fetch tags failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
