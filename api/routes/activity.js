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
             to_char(a."dateStart", 'YYYY-MM-DD') as date_start_str,
             to_char(a."dateEnd", 'YYYY-MM-DD') as date_end_str,
             ac.name as class_name, 
             ast.content as style_content,
             (SELECT json_agg(img) FROM "activityImg" WHERE "activityId" = a.id) as images
      FROM activity a
      LEFT JOIN "activityClass" ac ON a."classId" = ac.id
      LEFT JOIN "activityStyle" ast ON a."styleId" = ast.id
      ORDER BY a.id DESC
    `);
    const activities = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      startAt: row.date_start_str,
      endAt: row.date_end_str,
      content: row.content,
      classId: row.classId,
      styleId: row.styleId,
      className: row.class_name,
      styleContent: row.style_content,
      url: row.url,
      imageUrls: (row.images || []).map(img => `http://localhost:3000/uploads/activity/${img}`)
    }));
    res.json(activities);
  } catch (err) {
    console.error('Fetch activities failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: 新增活動
router.post('/activities', uploadActivity.array('images', 2), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { title, startAt, endAt, content, classId, styleId, url } = req.body;
    const files = req.files || [];
    
    const dStart = startAt ? startAt : null;
    const dEnd = endAt ? endAt : null;

    const result = await client.query(
      'INSERT INTO activity (title, "dateStart", "dateEnd", content, "classId", "styleId", url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, dStart, dEnd, content, classId, styleId, url]
    );
    const activityId = result.rows[0].id;

    if (files.length > 0) {
      for (const file of files) {
        await client.query('INSERT INTO "activityImg" ("activityId", img) VALUES ($1, $2)', [activityId, file.filename]);
      }
    }

    await client.query('COMMIT');
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create activity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

// API: 更新活動
router.put('/activities/:id', uploadActivity.array('images', 2), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = req.params.id;
    const { title, startAt, endAt, content, classId, styleId, url } = req.body;
    const files = req.files || [];
    const dStart = startAt ? startAt : null;
    const dEnd = endAt ? endAt : null;

    await client.query(
      'UPDATE activity SET title=$1, "dateStart"=$2, "dateEnd"=$3, content=$4, "classId"=$5, "styleId"=$6, url=$7 WHERE id=$8',
      [title, dStart, dEnd, content, classId, styleId, url, id]
    );

    // 如果有上傳新圖片，刪除舊的並存入新的
    if (files.length > 0) {
      const oldImgs = await client.query('SELECT img FROM "activityImg" WHERE "activityId"=$1', [id]);
      for (const row of oldImgs.rows) {
        const filePath = path.join('public', 'uploads', 'activity', row.img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      await client.query('DELETE FROM "activityImg" WHERE "activityId"=$1', [id]);

      for (const file of files) {
        await client.query('INSERT INTO "activityImg" ("activityId", img) VALUES ($1, $2)', [id, file.filename]);
      }
    }

    await client.query('COMMIT');
    res.json({ status: 'success' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update activity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

// API: 刪除活動
router.delete('/activities/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = req.params.id;
    
    // 找出所有圖片並刪除檔案
    const imgs = await client.query('SELECT img FROM "activityImg" WHERE "activityId"=$1', [id]);
    for (const row of imgs.rows) {
      const filePath = path.join('public', 'uploads', 'activity', row.img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // 刪除活動 (會 Cascade 刪除 activityImg 記錄)
    await client.query('DELETE FROM activity WHERE id=$1', [id]);

    await client.query('COMMIT');
    res.json({ status: 'success' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete activity failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    client.release();
  }
});

export default router;
