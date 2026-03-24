import express from 'express';
import cors from 'cors';
import pool from './db.js';

import adminRoutes from './routes/admin.js';
import calendarRoutes from './routes/calendar.js';
import activityRoutes from './routes/activity.js';
import commodityRoutes from './routes/commodity.js';
import boardGamesRoutes from './routes/boardGames.js';
import laprRoutes from './routes/lapr.js';
import tagRoutes from './routes/tag.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 靜態檔案伺服，讓前端可以讀取上傳的圖片
app.use('/uploads', express.static('public/uploads'));

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

// 註冊已拆分的 API 路由
app.use('/api', adminRoutes);
app.use('/api', calendarRoutes);
app.use('/api', activityRoutes);
app.use('/api', commodityRoutes);
app.use('/api', boardGamesRoutes);
app.use('/api', laprRoutes);
app.use('/api', tagRoutes);

// 啟動 Express 伺服器
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
