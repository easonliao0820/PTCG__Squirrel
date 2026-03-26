import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../db.js';

const router = express.Router();

const activityStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/uploads/activity';
    if (!fs.existsSync(dir)) {
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

// API: 取得所有活動 (支援分頁、搜尋與分類篩選)
router.get('/activities', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const classId = req.query.classId || 'all';

    let filters = [];
    let params = [];

    if (search) {
      params.push(`%${search}%`);
      filters.push(`(a.title ILIKE $${params.length} OR a.content ILIKE $${params.length})`);
    }

    if (classId !== 'all') {
      params.push(classId);
      filters.push(`a."classId" = $${params.length}`);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    // 取得總筆數
    const countRes = await pool.query(`SELECT COUNT(*) FROM activity a ${whereClause}`, params);
    const totalItems = parseInt(countRes.rows[0].count);

    // 取得分頁資料
    const dataParams = [...params, limit, offset];
    const result = await pool.query(`
      SELECT a.*, 
             to_char(a."dateStart", 'YYYY-MM-DD') as date_start_str,
             to_char(a."dateEnd", 'YYYY-MM-DD') as date_end_str,
             ac.name as class_name, 
             ast.content as style_content,
             (SELECT json_agg(img) FROM "activityImg" WHERE "activityId" = a.id) as images,
             (atop.id IS NOT NULL) as is_top
      FROM activity a
      LEFT JOIN "activityClass" ac ON a."classId" = ac.id
      LEFT JOIN "activityStyle" ast ON a."styleId" = ast.id
      LEFT JOIN "activityTop" atop ON a.id = atop.activityid
      ${whereClause}
      ORDER BY is_top DESC, a.id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, dataParams);

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
      isTop: row.is_top,
      imageUrls: (row.images || []).map(img => `http://localhost:3000/uploads/activity/${img}`)
    }));

    res.json({
      data: activities,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit
      }
    });
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

// API: 切換置頂狀態 (最多5項)
router.post('/activities/toggle-top', async (req, res) => {
  const { activityId, isTop } = req.body;
  try {
    if (isTop) {
      // 檢查是否已達 5 項上限
      const countRes = await pool.query('SELECT COUNT(*) FROM "activityTop"');
      if (parseInt(countRes.rows[0].count) >= 5) {
        return res.status(400).json({ status: 'error', message: '最多只能設定 5 個置頂輪播項目' });
      }
      await pool.query('INSERT INTO "activityTop" (activityid) VALUES ($1) ON CONFLICT DO NOTHING', [activityId]);
    } else {
      await pool.query('DELETE FROM "activityTop" WHERE activityid=$1', [activityId]);
    }
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Toggle top failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
