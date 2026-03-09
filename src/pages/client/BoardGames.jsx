import React, { useState } from 'react';
import styles from '../../styles/pages/BoardGames.module.scss';


const BoardGames = () => {
  // 模擬資料 (之後可接 API)
  const games = Array(12).fill({
    name: "桌遊名稱",
    time: "30min",
    players: "8~10人",
    category: "都可以",
    age: "18+"
  });

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>搜尋店有桌遊</h2>

      {/* 搜尋區 */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <input type="text" placeholder="搜尋桌遊名稱..." className={styles.searchInput} />
          <button className={styles.searchBtn}>搜尋按鈕</button>
        </div>

        {/* 下拉選單區 */}
        <div className={styles.filterRow}>
          {['建議人數', '建議組合', '建議時常', '建議年齡'].map((label) => (
            <div key={label} className={styles.filterGroup}>
              <span className={styles.filterLabel}>{label}：</span>
              <select className={styles.selectBox}>
                <option>下拉選單</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* 桌遊卡片網格 */}
      <div className={styles.gameGrid}>
        {games.map((game, index) => (
          <div key={index} className={styles.gameCard}>
            <div className={styles.imageBox}>
              {/* <img src="..." alt={game.name} /> */}
              <div className={styles.placeholder}>圖片預留區</div>
            </div>
            <div className={styles.infoBox}>
              <h3 className={styles.gameName}>{game.name}</h3>
              <div className={styles.tagGrid}>
                <div className={styles.tag}>遊玩時長：{game.time}</div>
                <div className={styles.tag}>建議組合：{game.category}</div>
                <div className={styles.tag}>建議人數：{game.players}</div>
                <div className={styles.tag}>建議年齡：{game.age}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 分頁按鈕 */}
      <div className={styles.pagination}>
        <span>&lt;</span>
        <span className={styles.active}>1</span>
        <span>2</span>
        <span>3</span>
        <span>&gt;</span>
      </div>
    </div>
  );
};

export default BoardGames;