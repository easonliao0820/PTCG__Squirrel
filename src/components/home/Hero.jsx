import React from 'react';
import styles from '../../styles/pages/home/Hero.module.scss';

const Hero = () => {
  return (
    <section className={styles.hero}>
      {/* 導覽按鈕 */}
      <button className={`${styles.navBtn} ${styles.prev}`}>〈</button>
      <button className={`${styles.navBtn} ${styles.next}`}>〉</button>

      <div className={styles.container}>
        {/* 左側：公告圖片區 */}
        <div className={styles.imageSection}>
          <div className={styles.imagePlaceholder}>
            {/* 放置佔位圖或活動圖 */}
            <img src="public\images\location\banner2.jpg" alt="超級球盃公告" />
          </div>
        </div>

        {/* 右側：文字資訊區 */}
        <div className={styles.infoSection}>
          {/* 標題區 */}
          <header className={styles.header}>
            <h1 className={styles.mainTitle}>超級球盃．店務對抗賽</h1>
            <p className={styles.subTitle}>2026 Season 01 | 訓練家實力驗證</p>
          </header>

          {/* 區塊 1：內文 (對應 SCSS nth-of-type(1)) */}
          <div className={styles.contentBox}>
            <div className={styles.textContent}>
              準備好與你的夥伴寶可夢並肩作戰了嗎？本次超級球盃旨在提供訓練家交流技術的舞台。無論你是剛入坑的新手，還是追求更高層次的戰略大師，我們都歡迎你前來挑戰！現場將有專業裁判指導，確保每場對決公平公正。
            </div>
          </div>

          {/* 區塊 2：注意事項 (對應 SCSS nth-of-type(2)) */}
          <div className={styles.contentBox}>
            <div className={styles.textContent}>
              <strong>【注意事項】</strong>
              賽制：標準環境 (Standard Regulation) <br />
              限額：32 名（採線上預約制）<br />
              備註：請務必於報到時提交完整 60 張卡表，嚴禁使用代牌。
            </div>
          </div>

          {/* 區塊 3：底部資訊 (對應 SCSS footerBox) */}
          <div className={styles.footerBox}>
            <p>活動日期：2026/03/15 (日) 14:00 | 主辦：松鼠偵探 PTCG 專門店</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;