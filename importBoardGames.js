import fs from 'fs';
import pool from './api/db.js';

async function importBoardGames() {
  const filePath = './boardGames.json';
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File ${filePath} not found. Please create it with the full JSON array.`);
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const boardGames = JSON.parse(rawData);
    
    console.log(`Successfully parsed ${boardGames.length} board games. Starting import...`);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // (Optional) If you want to clear existing data before insert:
      // await client.query('TRUNCATE TABLE "boardGames" RESTART IDENTITY CASCADE');

      let insertedCount = 0;
      for (const game of boardGames) {
        // game format:
        // "桌遊名稱": "字字轉機 (Anomia)"
        // "推薦人數": "3-6人"
        // "遊玩時間": "20-30分鐘"
        // "建議年齡": "10歲以上"
        // "遊戲說明": "考驗反應力..."
        // "分類標籤": ["歡樂", "反應", "語言"]
        
        // Ensure properties exist
        if (!game['桌遊名稱']) continue;

        const name = game['桌遊名稱'] || '';
        const people = game['推薦人數'] || '';
        const time = game['遊玩時間'] || '';
        const age = game['建議年齡'] || '';
        const content = game['遊戲說明'] || '';
        const tags = game['分類標籤'] || [];

        // Check if identical name already exists to prevent duplicate
        const existRes = await client.query('SELECT id FROM "boardGames" WHERE name = $1', [name]);
        let gameId;
        
        if (existRes.rows.length === 0) {
          const insertRes = await client.query(
            'INSERT INTO "boardGames" (name, time, age, people, content) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [name, time, age, people, content]
          );
          gameId = insertRes.rows[0].id;
          insertedCount++;
        } else {
          // You could also do an update here, but let's just get the id to update tags
          gameId = existRes.rows[0].id;
          
          await client.query(
            'UPDATE "boardGames" SET time=$1, age=$2, people=$3, content=$4 WHERE id=$5',
            [time, age, people, content, gameId]
          );
        }

        // Insert tags
        for (const title of tags) {
          let tagRes = await client.query('SELECT id FROM tag WHERE title = $1', [title]);
          let tagId;
          if (tagRes.rows.length === 0) {
            const newTag = await client.query('INSERT INTO tag (title) VALUES ($1) RETURNING id', [title]);
            tagId = newTag.rows[0].id;
          } else {
            tagId = tagRes.rows[0].id;
          }
          
          // Check if relation already exists
          const relateRes = await client.query(
            'SELECT * FROM "playTag" WHERE class = $1 AND "classId" = $2 AND "tagId" = $3',
            ['boardGames', gameId, tagId]
          );
          
          if (relateRes.rows.length === 0) {
            await client.query(
              'INSERT INTO "playTag" (class, "classId", "tagId") VALUES ($1, $2, $3)', 
              ['boardGames', gameId, tagId]
            );
          }
        }
      }

      await client.query('COMMIT');
      console.log(`Import completed successfully! Inserted/Updated ${boardGames.length} games.`);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Failed to import board games:', error);
  } finally {
    pool.end();
  }
}

importBoardGames();
