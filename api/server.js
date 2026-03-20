import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from './db.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 靜態檔案伺服，讓前端可以讀取上傳的圖片
app.use('/uploads', express.static('public/uploads'));

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
    // 檔名設定為 YYYYMM.ext，確保符合 DB 的 varchar(10) 限制
    // 例如 202401.jpg 或 202412.png (皆為 10 字元)
    const { year, month } = req.body;
    const paddedMonth = String(month).padStart(2, '0');
    // 取副檔名限制最多 4 個字元 (例如 .jpg, .png)
    const ext = path.extname(file.originalname).substring(0, 4);
    cb(null, `${year}${paddedMonth}${ext}`);
  }
});

const upload = multer({ storage: storage });

// API: 測試連線
app.get('/api/test_connection', async (req, res) => {
  try {
    const result = await pool.query('SELECT version()');
    res.json({
      status: 'success',
      message: '連線成功！Successfully connected to the PostgreSQL database via Node.js.',
      db_version: result.rows[0].version
    });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ status: 'error', message: 'Query failed: ' + error.message });
  }
});

// API: 管理員登入
app.post('/api/admin/login', async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({ status: 'error', message: '請提供帳號與密碼' });
    }

    const result = await pool.query(
      'SELECT id, account FROM admin WHERE account = $1 AND password = $2',
      [account, password]
    );

    if (result.rows.length > 0) {
      res.json({ status: 'success', message: '登入成功', user: result.rows[0] });
    } else {
      res.status(401).json({ status: 'error', message: '帳號或密碼錯誤' });
    }
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ status: 'error', message: '伺服器錯誤: ' + error.message });
  }
});

// API: 取得所有行事曆
app.get('/api/calendar', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM calendar ORDER BY year DESC, month DESC');
    // 把資料庫的 img 欄位轉換為完整 URL 給前端
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
app.post('/api/calendar/upload', upload.single('image'), async (req, res) => {
  try {
    const { year, month } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imgFilename = req.file.filename;

    // 檢查是否該月份已有資料
    const checkResult = await pool.query('SELECT id FROM calendar WHERE year = $1 AND month = $2', [year, month]);
    
    if (checkResult.rows.length > 0) {
      // 更新現有資料
      await pool.query('UPDATE calendar SET img = $1 WHERE year = $2 AND month = $3', [imgFilename, year, month]);
    } else {
      // 新增資料
      await pool.query('INSERT INTO calendar (year, month, img) VALUES ($1, $2, $3)', [year, month, imgFilename]);
    }

    res.json({ status: 'success', message: 'Calendar saved successfully', imageUrl: `http://localhost:3000/uploads/calendar/${imgFilename}` });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: 刪除行事曆
app.delete('/api/calendar/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    
    // 先找出圖片檔名以便刪除檔案
    const result = await pool.query('SELECT img FROM calendar WHERE year = $1 AND month = $2', [year, month]);
    if (result.rows.length > 0) {
      const imgFilename = result.rows[0].img;
      const filepath = path.join('public', 'uploads', 'calendar', imgFilename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      
      // 刪除資料庫記錄
      await pool.query('DELETE FROM calendar WHERE year = $1 AND month = $2', [year, month]);
    }
    
    res.json({ status: 'success', message: 'Calendar deleted successfully' });
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ error: error.message });
  }
});


// === Activity (活動) 設定 ===
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
app.get('/api/activities', async (req, res) => {
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
app.post('/api/activities', uploadActivity.single('image'), async (req, res) => {
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
app.put('/api/activities/:id', uploadActivity.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const { title, startAt, endAt, content, classId, styleId } = req.body;
    const dStart = startAt ? startAt : null;
    const dEnd = endAt ? endAt : null;

    let query = 'UPDATE activity SET title=$1, date_start=$2, date_end=$3, content=$4, class_id=$5, style_id=$6 WHERE id=$7 RETURNING *';
    let values = [title, dStart, dEnd, content, classId, styleId, id];

    if (req.file) {
      // 假設要更新圖片，先找出舊圖片刪除
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
app.delete('/api/activities/:id', async (req, res) => {
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

// 啟動 Express 伺服器
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
