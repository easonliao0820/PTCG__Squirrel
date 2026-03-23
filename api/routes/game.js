import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../db.js';

const router = express.Router();

const gameStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/uploads/game';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `game_${Date.now()}${ext}`); // img: varchar(30)
  }
});
const uploadGame = multer({ storage: gameStorage });

// API: 取得所有桌遊
router.get('/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM game ORDER BY id DESC');
    const games = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      playingTime: row.time,
      suggestedAge: row.age,
      playerCount: row.people,
      suitableGroup: row.groups,
      description: row.content,
      imageUrl: row.img ? `http://localhost:3000/uploads/game/${row.img}` : null
    }));
    res.json(games);
  } catch (err) {
    console.error('Fetch games failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 新增桌遊
router.post('/games', uploadGame.single('image'), async (req, res) => {
  try {
    const { name, time, age, people, groups, content } = req.body;
    const imgFilename = req.file ? req.file.filename : null;

    const result = await pool.query(
      'INSERT INTO game (name, time, age, people, groups, content, img) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, time, age, people, groups, content, imgFilename]
    );

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Create game failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 更新桌遊
router.put('/games/:id', uploadGame.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const { name, time, age, people, groups, content } = req.body;

    let query = 'UPDATE game SET name=$1, time=$2, age=$3, people=$4, groups=$5, content=$6 WHERE id=$7 RETURNING *';
    let values = [name, time, age, people, groups, content, id];

    if (req.file) {
      const oldResult = await pool.query('SELECT img FROM game WHERE id=$1', [id]);
      if (oldResult.rows.length > 0 && oldResult.rows[0].img) {
        const oldFile = path.join('public', 'uploads', 'game', oldResult.rows[0].img);
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      }

      query = 'UPDATE game SET name=$1, time=$2, age=$3, people=$4, groups=$5, content=$6, img=$7 WHERE id=$8 RETURNING *';
      values = [name, time, age, people, groups, content, req.file.filename, id];
    }

    const result = await pool.query(query, values);
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Update game failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 刪除桌遊
router.delete('/games/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const oldResult = await pool.query('SELECT img FROM game WHERE id=$1', [id]);
    if (oldResult.rows.length > 0 && oldResult.rows[0].img) {
      const oldFile = path.join('public', 'uploads', 'game', oldResult.rows[0].img);
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    }
    await pool.query('DELETE FROM game WHERE id=$1', [id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Delete game failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
