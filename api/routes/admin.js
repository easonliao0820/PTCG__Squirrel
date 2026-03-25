import express from 'express';
import pool from '../db.js';

const router = express.Router();

// API: 管理員登入
router.post('/admin/login', async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({ status: 'error', message: '請提供帳號與密碼' });
    }

    const result = await pool.query(
      'SELECT account FROM "user" WHERE account = $1 AND password = $2',
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

export default router;
