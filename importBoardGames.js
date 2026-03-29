import fs from 'fs';
import pool from './api/db.js';

async function importBoardGames() {
  const filePath = './boardGames.json';
  if (!fs.existsSync(filePath)) process.exit(1);

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const boardGames = JSON.parse(rawData);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Clearing existing board game tags and relationships...');
    // 1. Clear Phase
    await client.query('DELETE FROM "playTag" WHERE class = $1', ['boardGames']);
    await client.query('DELETE FROM tag WHERE class = $1', [0]);

    const tagCache = new Map();
    let processedCount = 0;

    for (const game of boardGames) {
      const name = game['桌遊名稱'] || '';
      const tags = Array.from(new Set(game['分類標籤'] || []));
      if (!name) continue;

      // Upsert board game
      let gameId;
      const existRes = await client.query('SELECT id FROM "boardGames" WHERE name = $1', [name]);
      if (existRes.rows.length === 0) {
        const res = await client.query(
          'INSERT INTO "boardGames" (name, time, age, people, content) VALUES ($1, $2, $3, $4, $5) RETURNING id', 
          [name, game['遊玩時間'] || '', game['建議年齡'] || '', game['推薦人數'] || '', game['遊戲說明'] || '']
        );
        gameId = res.rows[0].id;
      } else {
        gameId = existRes.rows[0].id;
        await client.query(
          'UPDATE "boardGames" SET time=$1, age=$2, people=$3, content=$4 WHERE id=$5', 
          [game['遊玩時間'] || '', game['建議年齡'] || '', game['推薦人數'] || '', game['遊戲說明'] || '', gameId]
        );
      }

      // Re-import tags
      for (const title of tags) {
        let tagId;
        if (tagCache.has(title)) {
          tagId = tagCache.get(title);
        } else {
          let tagRes = await client.query('SELECT id FROM tag WHERE title = $1', [title]);
          if (tagRes.rows.length === 0) {
            const res = await client.query('INSERT INTO tag (title, class) VALUES ($1, 0) RETURNING id', [title]);
            tagId = res.rows[0].id;
          } else {
            tagId = tagRes.rows[0].id;
            await client.query('UPDATE tag SET class = 0 WHERE id = $1', [tagId]);
          }
          tagCache.set(title, tagId);
        }

        // Link tag to game with robust ON CONFLICT
        await client.query(
          'INSERT INTO "playTag" (class, "classId", "tagId") VALUES ($1, $2, $3) ON CONFLICT (class, "classId", "tagId") DO NOTHING', 
          ['boardGames', gameId, tagId]
        );
      }
      processedCount++;
    }

    await client.query('COMMIT');
    console.log(`Successfully reset and re-imported tags for ${processedCount} board games.`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('ERROR during transaction:', e.message, e.detail);
    throw e;
  } finally {
    client.release();
    pool.end();
  }
}
importBoardGames();
