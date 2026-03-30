import './loadEnv.js'; // 必須放在第一行，確保所有模組載入前環境變數已就緒
import express from 'express';
import cors from 'cors';
import pool from './db.js';

// 導入路由
import adminRoutes from './routes/admin.js';
import calendarRoutes from './routes/calendar.js';
import activityRoutes from './routes/activity.js';
import commodityRoutes from './routes/commodity.js';
import boardGamesRoutes from './routes/boardGames.js';
import laprRoutes from './routes/lapr.js';
import tagRoutes from './routes/tag.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
  res.send('🚀 PTCG Squirrel API 運行中！請使用 /api/test_connection 測試連線。');
});

// Middleware
app.use(cors({ origin: true, credentials: true })); 
app.use(express.json());

// 註冊路由
app.use('/api', adminRoutes);
app.use('/api', calendarRoutes);
app.use('/api', activityRoutes);
app.use('/api', commodityRoutes);
app.use('/api', boardGamesRoutes);
app.use('/api', laprRoutes);
app.use('/api', tagRoutes);

// API: 測試連線
app.get('/api/test_connection', async (req, res) => {
  try {
    const result = await pool.query('SELECT version()');
    res.json({
      status: 'success',
      message: '✅ 連線成功！已成功連至 Supabase 雲端資料庫。',
      db_version: result.rows[0].version
    });
  } catch (error) {
    console.error('❌ 連線失敗:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 後端伺服器運行中，埠號: ${PORT}`);
  console.log('-------------------------------------------');
});