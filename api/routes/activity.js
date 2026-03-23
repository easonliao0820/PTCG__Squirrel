import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../db.js';

const router = express.Router();

const activityStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/uploads/activity';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `act_${Date.now()}${ext}`); // img: varchar(50)
  }
});
const uploadActivity = multer({ storage: activityStorage });

// API: 取得所有活動
router.get('/activities', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
             to_char(a.date_start, 'YYYY-MM-DD') as date_start_str,
             to_char(a.date_end, 'YYYY-MM-DD') as date_end_str,
             ac.name as class_name, 
             ast.content as style_content
      FROM activity a
      JOIN activity_class ac ON a.class_id = ac.id
      JOIN activity_style ast ON a.style_id = ast.id
      ORDER BY a.id DESC
    `);
    const activities = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      startAt: row.date_start_str,
      endAt: row.date_end_str,
      content: row.content,
      classId: row.class_id,
      styleId: row.style_id,
      className: row.class_name,
      styleContent: row.style_content,
      imageUrl: row.img ? `http://localhost:3000/uploads/activity/${row.img}` : null
    }));
    res.json(activities);
  } catch (err) {
    console.error('Fetch activities failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 新增活動
router.post('/activities', uploadActivity.single('image'), async (req, res) => {
  try {
    const { title, startAt, endAt, content, classId, styleId } = req.body;
    const imgFilename = req.file ? req.file.filename : null;
    
    // date_start and date_end might be empty strings from frontend
    const dStart = startAt ? startAt : null;
    const dEnd = endAt ? endAt : null;

    const result = await pool.query(
      'INSERT INTO activity (title, date_start, date_end, content, class_id, style_id, img) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, dStart, dEnd, content, classId, styleId, imgFilename]
    );

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Create activity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 更新活動
router.put('/activities/:id', uploadActivity.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const { title, startAt, endAt, content, classId, styleId } = req.body;
    const dStart = startAt ? startAt : null;
    const dEnd = endAt ? endAt : null;

    let query = 'UPDATE activity SET title=$1, date_start=$2, date_end=$3, content=$4, class_id=$5, style_id=$6 WHERE id=$7 RETURNING *';
    let values = [title, dStart, dEnd, content, classId, styleId, id];

    if (req.file) {
      const oldResult = await pool.query('SELECT img FROM activity WHERE id=$1', [id]);
      if (oldResult.rows.length > 0 && oldResult.rows[0].img) {
        const oldFile = path.join('public', 'uploads', 'activity', oldResult.rows[0].img);
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      }

      query = 'UPDATE activity SET title=$1, date_start=$2, date_end=$3, content=$4, class_id=$5, style_id=$6, img=$7 WHERE id=$8 RETURNING *';
      values = [title, dStart, dEnd, content, classId, styleId, req.file.filename, id];
    }

    const result = await pool.query(query, values);
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Update activity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 刪除活動
router.delete('/activities/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const oldResult = await pool.query('SELECT img FROM activity WHERE id=$1', [id]);
    if (oldResult.rows.length > 0 && oldResult.rows[0].img) {
      const oldFile = path.join('public', 'uploads', 'activity', oldResult.rows[0].img);
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    }
    await pool.query('DELETE FROM activity WHERE id=$1', [id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Delete activity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
