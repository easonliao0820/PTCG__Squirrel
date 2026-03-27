import pool from './api/db.js';

const events = [
    {
        title: '3/19 卡牌挑戰賽',
        dateStart: '2026-03-19',
        dateEnd: '2026-03-19',
        content: '時間：20:00\n報名：$100\n獎勵：指定刮刮樂+積分，冠軍再拿參加人數的卡包！'
    },
    {
        title: '3/20 週五奪盒賽',
        dateStart: '2026-03-20',
        dateEnd: '2026-03-20',
        content: '時間：19:30\n報名：$300\n獎勵：參加獎 2 包補充包，冠軍 2 盒補充包，亞軍至八強皆有一番賞！'
    },
    {
        title: '3/21 週末早鳥特訓營',
        dateStart: '2026-03-21',
        dateEnd: '2026-03-21',
        content: '時間：10:30\n早起打牌接續下午場，學生朋友有驚喜，三連勝再拿 $100 購物金！'
    },
    {
        title: '3/21-22 寶可夢卡牌日',
        dateStart: '2026-03-21',
        dateEnd: '2026-03-22',
        content: '時間：14:00\n報名：$150\n獎勵：依勝場數領取補充包或「夢想 EX」包，三勝加碼一番賞'
    },
    {
        title: '3/21 開放道館賽',
        dateStart: '2026-03-21',
        dateEnd: '2026-03-21',
        content: '時間：16:00\n報名：$50 (全額折抵店內消費)\n獎勵：PR 包 & 積分，小資練牌首選！'
    },
    {
        title: '3/22 松鼠窩道館賽',
        dateStart: '2026-03-22',
        dateEnd: '2026-03-22',
        content: '時間：10:30\n報名：$300\n獎勵：冠軍爽領 2 盒補充包，前八強通通有一番賞抽獎！'
    }
];

async function importEvents() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Starting PTCG events batch 2 import...');
        
        for (const event of events) {
            await client.query(
                `INSERT INTO activity ("classId", title, content, "dateStart", "dateEnd", style) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [2, event.title, event.content, event.dateStart, event.dateEnd, 0]
            );
            console.log(`Inserted: ${event.title}`);
        }
        
        await client.query('COMMIT');
        console.log('PTCG events batch 2 import successful!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('PTCG events batch 2 import failed:', err);
    } finally {
        client.release();
        process.exit();
    }
}

importEvents();
