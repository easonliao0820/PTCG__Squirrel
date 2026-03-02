import React from 'react';
import styles from '../../styles/components/home/LocationMap.module.scss';

const MAP_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.309146205305!2d121.49921927614997!3d25.06345967779733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a922b8fdfb2f%3A0x9ad16fece18a95ec!2z5p2-6byg56qpIOahjOmBiuiBmuacg-epuumWkw!5e0!3m2!1szh-TW!2stw!4v1770729910236!5m2!1szh-TW!2stw';
const MAP_LINK = 'https://maps.app.goo.gl/YourMapLinkHere';

const LocationMap = () => {
  return (
    <section id="map" className={styles.mapSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>地理位置和相關規則</h2>

        <div className={styles.layout}>
          {/* 左側：從 BusinessInfo 整合過來的資訊 */}
          <div className={styles.infoList}>
            
            {/* 1. 營業時間 */}
            <div className={styles.infoBox}>
              <h4>營業時間及規則</h4>
              <ul className={styles.detailList}>
                <li>周二～周五 15:00－22:00 (免入場費)</li>
                <li>周六、周日 10:00－22:00 (一小時 $50 / 全日 $200)</li>
                <li>店內禁止外食，假日前一天延長至 24:00</li>
              </ul>
            </div>

            {/* 2. 地址 */}
            <div className={styles.infoBox}>
              <h4>地址</h4>
              <p>松鼠窩桌遊館</p>
              <p>新北市三重區重新路一段 78 號 2 樓</p>
              <p className={styles.subText}>（捷運台北橋站步行約 2 分鐘）</p>
            </div>

            {/* 3. 聯絡方式 */}
            <div className={styles.infoBox}>
              <h4>聯絡方式</h4>
              <p>電話：<a href="tel:0229747867">(02) 2974-7867</a></p>
              <p>Email：<a href="mailto:boardgame.squirrel@gmail.com">boardgame.squirrel@gmail.com</a></p>
            </div>
          </div>

          {/* 右側：地圖 */}
          <div className={styles.mapWrap}>
            <div className={styles.mapFrame}>
              <iframe
                title="松鼠窩桌遊館 地圖"
                src={MAP_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
              在 Google 地圖上開啟
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;