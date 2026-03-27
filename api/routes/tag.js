import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/tags: Fetch all unique tags, optionally filtered by class
router.get('/tags', async (req, res) => {
  const { class: tagClassStr } = req.query;
  try {
    let query = 'SELECT title FROM tag';
    let params = [];
    
    // Check if tagClassStr is provided and not empty
    if (tagClassStr !== undefined && tagClassStr !== '') {
      const tagClass = parseInt(tagClassStr, 10);
      if (!isNaN(tagClass)) {
        query += ' WHERE class = $1';
        params.push(tagClass);
      }
    }
    
    query += ' ORDER BY title ASC';
    
    const result = await pool.query(query, params);
    const tags = result.rows.map(row => row.title);
    res.json(tags);
  } catch (err) {
    console.error('Fetch tags failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
