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

  const categories = ["PTCG", "超人力霸王", "桌遊", "比賽", "店辦活動"];
  const years = ["2023", "2024", "2025", "2026"];
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>活動查詢</h2>

      {/* 搜尋與篩選 */}
      <div className={styles.filterSection}>
        <div className={styles.searchBar}>
          <input type="text" placeholder="搜尋活動名稱..." />
          <button className={styles.searchBtn}>搜尋按鈕</button>
        </div>
        
        <div className={styles.tagGroup}>
          <div className={styles.catTags}>
            {categories.map(cat => <button key={cat} className={styles.tagBtn}>{cat}</button>)}
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
            <span className={styles.title}>活動標題 (版型一)</span>
            <div className={styles.headerRight}>
              <span className={styles.time}>舉辦時間段：12/20~12/30</span>
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
                <div className={styles.infoBar}>活動細節摘要</div>
                <div className={styles.mainText}>內文內容區塊...</div>
                <div className={styles.noticeText}>注意事項區塊...</div>
                <div className={styles.dateBar}>日期與主辦方</div>
              </div>
            </div>
          </div>
        </div>

        {/* 第二種版型 (文左圖右) */}
        <div className={`${styles.eventItem} ${activeId === 2 ? styles.isOpen : ''}`}>
          <div className={styles.eventHeader} onClick={() => handleToggle(2)}>
            <span className={styles.title}>活動標題 (版型二)</span>
            <div className={styles.headerRight}>
              <span className={styles.time}>舉辦時間：12/20</span>
              <span className={styles.arrow}>{activeId === 2 ? '▲' : '▼'}</span>
            </div>
          </div>
          <div className={styles.eventBody}>
            {/* 版型二：使用 layoutType2 class */}
            <div className={`${styles.contentLayout} ${styles.layoutType2}`}>
              <div className={styles.textCol}>
                <div className={styles.infoBar}>活動細節摘要</div>
                <div className={styles.mainText}>內文內容區塊...</div>
                <div className={styles.noticeText}>注意事項區塊...</div>
                <div className={styles.dateBar}>日期與主辦方</div>
              </div>
              <div className={styles.imageCol}>
                <div className={styles.imgPlaceholder}>側邊大海報</div>
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