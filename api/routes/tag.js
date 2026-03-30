import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/tags: Fetch all tags with their class metadata
router.get('/tags', async (req, res) => {
  try {
    const result = await pool.query('SELECT title, class FROM tag ORDER BY title ASC');
    
    // 將後端的整數 class (0, 1) 轉換為前端辨識的字串 ('boardGames', 'lapr')
    const tags = result.rows.map(row => ({
      title: row.title,
      class: row.class === 1 ? 'lapr' : 'boardGames'
    }));

    res.json({
      status: 'success',
      data: tags
    });
  } catch (err) {
    console.error('Fetch tags failed:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
