import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../db.js';

const router = express.Router();

const commodityStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/uploads/commodity';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `com_${Date.now()}${ext}`); // img: varchar(50)
  }
});
const uploadCommodity = multer({ storage: commodityStorage });

// API: 取得所有商品
router.get('/commodities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM commodity ORDER BY id DESC');
    const commodities = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      price: row.money, // db column is 'money'
      stock: row.stock,
      content: row.content, // 商品說明
      imageUrl: row.img ? `http://localhost:3000/uploads/commodity/${row.img}` : null
    }));
    res.json(commodities);
  } catch (err) {
    console.error('Fetch commodities failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 新增商品
router.post('/commodities', uploadCommodity.single('image'), async (req, res) => {
  try {
    const { name, price, stock, content } = req.body;
    const imgFilename = req.file ? req.file.filename : null;

    const result = await pool.query(
      'INSERT INTO commodity (name, money, stock, img, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, Number(price) || 0, Number(stock) || 0, imgFilename, content || null]
    );

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Create commodity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 更新商品
router.put('/commodities/:id', uploadCommodity.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, stock, content } = req.body;

    let query = 'UPDATE commodity SET name=$1, money=$2, stock=$3, content=$4 WHERE id=$5 RETURNING *';
    let values = [name, Number(price) || 0, Number(stock) || 0, content || null, id];

    if (req.file) {
      const oldResult = await pool.query('SELECT img FROM commodity WHERE id=$1', [id]);
      if (oldResult.rows.length > 0 && oldResult.rows[0].img) {
        const oldFile = path.join('public', 'uploads', 'commodity', oldResult.rows[0].img);
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      }

      query = 'UPDATE commodity SET name=$1, money=$2, stock=$3, content=$4, img=$5 WHERE id=$6 RETURNING *';
      values = [name, Number(price) || 0, Number(stock) || 0, content || null, req.file.filename, id];
    }

    const result = await pool.query(query, values);
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Update commodity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 刪除商品
router.delete('/commodities/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const oldResult = await pool.query('SELECT img FROM commodity WHERE id=$1', [id]);
    if (oldResult.rows.length > 0 && oldResult.rows[0].img) {
      const oldFile = path.join('public', 'uploads', 'commodity', oldResult.rows[0].img);
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    }
    await pool.query('DELETE FROM commodity WHERE id=$1', [id]);
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Delete commodity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
