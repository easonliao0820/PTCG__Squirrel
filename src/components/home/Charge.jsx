import React, { useState } from 'react';
import styles from '../../styles/components/home/Charge.module.scss';

const Charge = () => {
  const [activeTab, setActiveTab] = useState('bar');
  const [zoomImg, setZoomImg] = useState(null);

  const serviceData = {
    bar: {
      label: '餐飲吧檯',
      images: ['/images/area/bar1.jpeg', '/images/area/bar2.jpeg', '/images/area/bar3.jpeg', '/images/area/bar4.jpeg'],
      desc: '提供各式飲品與輕食，讓你在對戰之餘也能享受悠閒的補給時光。'
    },
    play: {
      label: '遊玩區域',
      images: ['/images/area/env1.jpeg', '/images/area/env2.jpeg', '/images/area/env3.jpeg', '/images/area/env4.jpeg'],
      desc: '舒適的遊玩區域，提供各式桌遊，和足夠的座位讓您與親朋好友盡情享受遊玩時光。'
    },
    sales: {
      label: '單卡販售',
      images: ['/images/area/sales1.png', '/images/area/sales2.jpeg', '/images/area/sales3.jpeg', '/images/area/sales4.jpeg'],
      desc: '豐富的單卡與稀有收藏供選購，不管是組牌需要的強力關鍵卡或是珍稀卡，都可以來這裡尋找。'
    },
    accessories: {
      label: '週邊配件',
      images: ['/images/area/product1.jpeg', '/images/area/product2.jpeg', '/images/area/product3.jpeg', '/images/area/product4.jpg'],
      desc: '精選各式牌套、牌盒與原創周邊，為你的愛牌提供最萬全的保護與裝飾。'
    }
  };

  const currentData = serviceData[activeTab] || serviceData.bar;

  return (
    <section className={styles.charge}>
      <div className={styles.container}>
        <h3 className={styles.sectionTitle}>場域空間</h3>
        <div className={styles.layout}>
          {/* 左側 Sidebar */}
          <div className={styles.sidebar}>
            {Object.entries(serviceData).map(([id, data]) => (
              <button 
                key={id}
                className={`${styles.tabBtn} ${activeTab === id ? styles.active : ''}`}
                onClick={() => setActiveTab(id)}
              >
                {data.label}
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