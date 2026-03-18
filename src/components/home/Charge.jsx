import React, { useState } from 'react';
import styles from '../../styles/components/home/Charge.module.scss';

const Charge = () => {
  const [activeTab, setActiveTab] = useState('bar');
  const [zoomImg, setZoomImg] = useState(null);

  const serviceData = {
    bar: {
      images: ['/images/area/bar1.jpeg', '/images/area/bar2.jpeg', '/images/area/bar3.jpeg', '/images/area/bar4.jpeg'],
      desc: '提供各式飲品與輕食，讓你在對戰之餘也能補充能量。'
    },
    play: {
      images: ['/images/area/env1.jpeg', '/images/area/env2.jpeg', '/images/area/env3.jpeg', '/images/area/env4.jpeg'],
      desc: '寬敞舒適的對戰空間，配備專業牌墊與計分器。'
    },
    sales: {
      images: ['/images/area/sales1.png', '/images/area/sales2.jpeg', '/images/area/sales3.jpeg', '/images/area/sales4.jpeg'],
      desc: '寬敞舒適的對戰空間，配備專業牌墊與計分器。'
    }
    // ... 其他資料類推
  };

  const currentData = serviceData[activeTab] || serviceData.bar;

  return (
    <section className={styles.charge}>
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
                {tab === 'bar' ? '吧檯' : tab === 'play' ? '遊玩區域' : '單卡販售'}
              </button>
            ))}
          </div>

          {/* 右側內容：加入 Hover 遮罩 */}
          <div className={styles.contentGrid} key={activeTab}>
            <div className={styles.topRow}>
              {currentData.images.slice(0, 3).map((img, i) => (
                <div key={i} className={styles.imgBox} onClick={() => setZoomImg(img)}>
                  <img src={img} alt="preview" />
                  <div className={styles.overlay}>
                    <span>View Full Image</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.bottomRow}>
              <div className={styles.largeImgBox} onClick={() => setZoomImg(currentData.images.at(-1))}>
                <img src={currentData.images.at(-1)} alt="large preview" />
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

export default Charge;