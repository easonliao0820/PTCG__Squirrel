import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/pages/home/Hero.module.scss';

const Hero = () => {
  const [topEvents, setTopEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/activities/top');
        if (res.data.status === 'success') {
          setTopEvents(res.data.data);
        }
      } catch (err) {
        console.error('Fetch top events failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopEvents();
  }, []);

  // 自動輪播：5秒換一次
  useEffect(() => {
    if (topEvents.length <= 1) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(timer);
  }, [topEvents, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % topEvents.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + topEvents.length) % topEvents.length);
  };

  if (loading) {
    return <section className={styles.hero}><div className={styles.container}>載入中...</div></section>;
  }

  if (topEvents.length === 0) {
    return null; // 或者顯示預設內容
  }

  const currentEvent = topEvents[currentIndex];

  return (
    <section className={styles.hero}>
      {/* 導覽按鈕 */}
      {topEvents.length > 1 && (
        <>
          <button className={`${styles.navBtn} ${styles.prev}`} onClick={handlePrev}>〈</button>
          <button className={`${styles.navBtn} ${styles.next}`} onClick={handleNext}>〉</button>
        </>
      )}

      <div className={styles.container} key={currentIndex}>
        {/* 左側：公告圖片區 */}
        <div className={styles.imageSection}>
          <div className={styles.imagePlaceholder}>
            {currentEvent.imageUrls && currentEvent.imageUrls.length > 0 ? (
              <img src={currentEvent.imageUrls[0]} alt={currentEvent.title} />
            ) : (
              <div className={styles.imgPlaceholder}>無圖片</div>
            )}
          </div>
        </div>

        {/* 右側：文字資訊區 */}
        <div className={styles.infoSection}>
          {/* 標題區 */}
          <header className={styles.header}>
            <h1 className={styles.mainTitle}>{currentEvent.title}</h1>
            <p className={styles.subTitle}>{currentEvent.className || '最新活動'}</p>
          </header>

          {/* 區塊 1：內文 */}
          <div className={`${styles.contentBox} ${styles.textContentBox}`}>
            <div className={styles.textContent} style={{ whiteSpace: 'pre-wrap' }}>
              {currentEvent.content}
            </div>
          </div>

          {/* 區塊 2：連結資訊 (如果有) */}
          {currentEvent.url && (
            <div className={`${styles.contentBox} ${styles.linkBox}`}>
              <div className={styles.textContent}>
                <a 
                  href={currentEvent.url} 
                  target="_blank" 
                  rel="noreferrer" 
                >
                  前往活動連結／報名資訊
                </a>
              </div>
            </div>
          )}

          {/* 區塊 3：底部資訊 */}
          <div className={styles.footerBox}>
            <p>
              開始日期：{currentEvent.startAt || '即日起'} 
              {currentEvent.endAt ? ` ~ ${currentEvent.endAt}` : ''} 
              | 主辦：松鼠偵探 PTCG 專門店
            </p>
          </div>
        </div>
      </div>
      {/* 向下滑動指示器 */}
      <div className={styles.scrollIndicator}>
        <span>向下捲動查看更多</span>
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
