import pool from './api/db.js';

const events = [
    {
        title: '3/26 售前奪盒賽',
        dateStart: '2026-03-26',
        dateEnd: '2026-03-26',
        content: '時間：20:00\n備註：可使用M4影印代牌\n報名：$250\n獎勵：冠軍一盒忍者飛旋的特別組合'
    },
    {
        title: '3/27 週五奪盒賽',
        dateStart: '2026-03-27',
        dateEnd: '2026-03-27',
        content: '時間：19:30\n報名：$300\n獎勵：參加獎 2 包補充包，冠軍 2 盒補充包，亞軍至八強皆有一番賞！'
    },
    {
        title: '3/28 週末早鳥特訓營',
        dateStart: '2026-03-28',
        dateEnd: '2026-03-28',
        content: '時間：10:30\n早起打牌接續下午場，學生朋友有驚喜，三連勝再拿 $100 購物金！'
    },
    {
        title: '3/28-29 寶可夢卡牌日',
        dateStart: '2026-03-28',
        dateEnd: '2026-03-29',
        content: '時間：14:00\n報名：$150\n獎勵：依勝場數領取補充包或「夢想 EX」包，三勝加碼一番賞'
    },
    {
        title: '3/28 開放道館賽',
        dateStart: '2026-03-28',
        dateEnd: '2026-03-28',
        content: '時間：16:00\n報名：$50 (全額折抵店內消費)\n獎勵：PR 包 & 積分，小資練牌首選！'
    },
    {
        title: '3/29 松鼠窩道館賽',
        dateStart: '2026-03-29',
        dateEnd: '2026-03-29',
        content: '時間：10:30\n報名：$300\n獎勵：冠軍爽領 2 盒補充包，前八強通通有一番賞抽獎！'
    }
];

async function importEvents() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Starting PTCG events import...');
        
        for (const event of events) {
            await client.query(
                `INSERT INTO activity ("classId", title, content, "dateStart", "dateEnd", style) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [2, event.title, event.content, event.dateStart, event.dateEnd, 0]
            );
            console.log(`Inserted: ${event.title}`);
        }
        
        await client.query('COMMIT');
        console.log('PTCG events import successful!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('PTCG events import failed:', err);
    } finally {
        client.release();
        process.exit();
    }
}

importEvents();
