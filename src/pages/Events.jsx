import React, { useState } from 'react';
import styles from '../styles/pages/Events.module.scss'

const Events = () => {
  const [activeId, setActiveId] = useState(null);
  const [searchYear, setSearchYear] = useState("2024");
  const [searchMonth, setSearchMonth] = useState("12");

  // 互斥邏輯：打開新的會自動關閉舊的
  const handleToggle = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const categories = [
    { label: "PTCG", id: "ptcg" },
    { label: "超人力霸王", id: "ultra" },
    { label: "桌遊", id: "boardgame" },
    { label: "比賽", id: "match" },
    { label: "店辦活動", id: "shop" }
  ];
  const years = ["2023", "2024", "2025", "2026"];
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>活動查詢</h2>

      {/* 搜尋與篩選 */}
      <div className={styles.filterSection}>
        <div className={styles.searchBar}>
          <input type="text" placeholder="搜尋活動名稱..." />
          <button className={styles.searchBtn}>搜尋</button>
        </div>

        <div className={styles.tagGroup}>
          <div className={styles.catTags}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.tagBtn} ${styles[cat.id]}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 月份與年份查詢 */}
          <div className={styles.dateSelectors}>
            <select value={searchYear} onChange={(e) => setSearchYear(e.target.value)}>
              {years.map(y => <option key={y} value={y}>{y} 年</option>)}
            </select>
            <select value={searchMonth} onChange={(e) => setSearchMonth(e.target.value)}>
              {months.map(m => <option key={m} value={m}>{m} 月</option>)}
            </select>
            <button className={styles.queryBtn}>月份查詢</button>
          </div>
        </div>
      </div>

      <div className={styles.eventList}>
        {/* 第一種版型 (圖左文右) */}
        <div className={`${styles.eventItem} ${activeId === 1 ? styles.isOpen : ''}`}>
          <div className={styles.eventHeader} onClick={() => handleToggle(1)}>
            <span className={styles.title}>週五 PTCG 訓練家聚會</span>
            <div className={styles.headerRight}>
              <span className={styles.time}>舉辦時間：12/20 (五) 19:00</span>
              <span className={styles.arrow}>{activeId === 1 ? '▲' : '▼'}</span>
            </div>
          </div>
          <div className={styles.eventBody}>
            <div className={styles.contentLayout}>
              <div className={styles.imageCol}>
                <div className={styles.imgPlaceholder}>海報 1</div>
                <div className={styles.imgPlaceholder}>海報 2</div>
              </div>
              <div className={styles.textCol}>
                <div className={styles.infoBar}>適合所有程度的玩家，現場有小老師教學。</div>
                <div className={styles.mainText}>
                  <strong>活動內容：</strong>
                  <ul>
                    <li>自由對戰與交流</li>
                    <li>新卡組構築指導</li>
                    <li>參加即贈送限量推廣卡</li>
                  </ul>
                </div>
                <div className={styles.noticeText}>
                  <strong>注意事項：</strong>
                  <ul>
                    <li>請自備牌組與指示物</li>
                    <li>店內禁帶外食</li>
                  </ul>
                </div>
                <div className={styles.dateBar}>2024/12/20 · 松鼠窩</div>
              </div>
            </div>
          </div>
        </div>

        {/* 第二種版型 (文左圖右) */}
        <div className={`${styles.eventItem} ${activeId === 2 ? styles.isOpen : ''}`}>
          <div className={styles.eventHeader} onClick={() => handleToggle(2)}>
            <span className={styles.title}>超人力霸王大賽 - 冬季盃</span>
            <div className={styles.headerRight}>
              <span className={styles.time}>舉辦時間：12/22 (日) 14:00</span>
              <span className={styles.arrow}>{activeId === 2 ? '▲' : '▼'}</span>
            </div>
          </div>
          <div className={styles.eventBody}>
            {/* 版型二：使用 layoutType2 class */}
            <div className={`${styles.contentLayout} ${styles.layoutType2}`}>
              <div className={styles.textCol}>
                <div className={styles.infoBar}>爭奪年度最強稱號，豐富獎金等你拿！</div>
                <div className={styles.mainText}>
                  <strong>比賽規則：</strong>
                  <ul>
                    <li>標準賽制，瑞士輪 5 回合</li>
                    <li>前 8 強進行淘汰賽</li>
                  </ul>
                </div>
                <div className={styles.noticeText}>需事先透過官方 APP 報名。</div>
                <div className={styles.dateBar}>2024/12/22 · 松鼠窩</div>
              </div>
              <div className={styles.imageCol}>
                <div className={styles.imgPlaceholder}>賽事大海報</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分頁按鈕... */}
    </div>
  );
};

export default Events;