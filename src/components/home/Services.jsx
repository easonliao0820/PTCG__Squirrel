import React, { useState } from 'react';
import styles from '../../styles/components/home/Services.module.scss';

const Services = () => {
  const [activeTab, setActiveTab] = useState('bar');
  const [zoomImg, setZoomImg] = useState(null);

  const serviceData = {
    bar: {
      images: ['/images/location/env-1.png', '/images/location/env-2.png', '/images/location/env-3.png'],
      desc: '提供各式飲品與輕食，讓你在對戰之餘也能補充能量。'
    },
    play: {
      images: ['/images/location/env-4.png', '/images/location/env-5.png', '/images/location/env-6.png'],
      desc: '寬敞舒適的對戰空間，配備專業牌墊與計分器。'
    }
    // ... 其他資料類推
  };

  const currentData = serviceData[activeTab] || serviceData.bar;

  return (
    <section className={styles.services}>
      <div className={styles.container}>
        <h3 className={styles.sectionTitle}>區域介紹</h3>
        <div className={styles.layout}>
          {/* 左側 Sidebar */}
          <div className={styles.sidebar}>
            {Object.keys(serviceData).map((tab) => (
              <button 
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'bar' ? '吧檯' : '遊玩區域'}
              </button>
            ))}
          </div>

          {/* 右側內容：加入 Hover 遮罩 */}
          <div className={styles.contentGrid} key={activeTab}>
            <div className={styles.topRow}>
              {currentData.images.map((img, i) => (
                <div key={i} className={styles.imgBox} onClick={() => setZoomImg(img)}>
                  <img src={img} alt="preview" />
                  <div className={styles.overlay}>
                    <span>View Full Image</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.bottomRow}>
              <div className={styles.largeImgBox} onClick={() => setZoomImg(currentData.images[0])}>
                <img src={currentData.images[0]} alt="large preview" />
                <div className={styles.overlay}>
                  <span>View Full Image</span>
                </div>
              </div>
              <div className={styles.textBox}>
                <p>{currentData.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 彈出層 (Modal) */}
      {zoomImg && (
        <div className={styles.modalOverlay} onClick={() => setZoomImg(null)}>
          <div className={styles.closeBtn}>×</div>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={zoomImg} alt="Zoomed" />
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;