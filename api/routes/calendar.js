import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../db.js';

const router = express.Router();

// 設定 Multer 儲存位置與檔名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/uploads/calendar';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const { year, month } = req.body;
    const paddedMonth = String(month).padStart(2, '0');
    const ext = path.extname(file.originalname).substring(0, 4);
    cb(null, `${year}${paddedMonth}${ext}`);
  }
});

const upload = multer({ storage: storage });

// API: 取得所有行事曆
router.get('/calendar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM calendar ORDER BY year DESC, month DESC');
    const calendars = result.rows.map(row => ({
      ...row,
      imageUrl: `http://localhost:3000/uploads/calendar/${row.img}`
    }));
    res.json(calendars);
  } catch (error) {
    console.error('Fetch calendars failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: 上傳/更新行事曆
router.post('/calendar/upload', upload.single('image'), async (req, res) => {
  try {
    const { year, month } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imgFilename = req.file.filename;

    const checkResult = await pool.query('SELECT id FROM calendar WHERE year = $1 AND month = $2', [year, month]);
    
    if (checkResult.rows.length > 0) {
      await pool.query('UPDATE calendar SET img = $1 WHERE year = $2 AND month = $3', [imgFilename, year, month]);
    } else {
      await pool.query('INSERT INTO calendar (year, month, img) VALUES ($1, $2, $3)', [year, month, imgFilename]);
    }

    res.json({ status: 'success', message: 'Calendar saved successfully', imageUrl: `http://localhost:3000/uploads/calendar/${imgFilename}` });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: 刪除行事曆
router.delete('/calendar/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const result = await pool.query('SELECT img FROM calendar WHERE year = $1 AND month = $2', [year, month]);
    if (result.rows.length > 0) {
      const imgFilename = result.rows[0].img;
      const filepath = path.join('public', 'uploads', 'calendar', imgFilename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      
      await pool.query('DELETE FROM calendar WHERE year = $1 AND month = $2', [year, month]);
    }
    
    res.json({ status: 'success', message: 'Calendar deleted successfully' });
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
