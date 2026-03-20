import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = 3000;

// Middleware
// 允許跨域請求，讓 Vite (Port 5173) 能夠正常請求後端 (Port 3000)
app.use(cors());
// 能夠正確解析前端傳來的 JSON 格式請求本體 (req.body)
app.use(express.json());

// 測試連線的 API 路由 (相等於原本的 test_connection.php)
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
    res.status(500).json({
      status: 'error',
      message: 'Query failed: ' + error.message
    });
  }
});

// 啟動 Express 伺服器
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
