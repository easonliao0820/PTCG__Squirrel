import React from 'react';
import styles from '../../styles/pages/home/LocationGallery.module.scss';

const Gallery = () => {
  // 準備 6 張示意圖 (實際開發請替換成真實路徑)
  const images = [
    { id: 1, src: '/images/location/env-1.png', alt: '店內環境 1' },
    { id: 2, src: '/images/location/env-2.png', alt: '店內環境 2' },
    { id: 3, src: '/images/location/env-3.png', alt: '店內環境 3' },
    { id: 4, src: '/images/location/env-4.png', alt: '店內環境 4' },
    { id: 5, src: '/images/location/env-5.png', alt: '店內環境 5' },
    { id: 6, src: '/images/location/env-6.png', alt: '店內環境 6' },
  ];

  return (
    <section className={styles.gallerySection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>店內環境</h2>
        
        <div className={styles.photoGrid}>
          {images.map((img, index) => (
            <div key={img.id} className={`${styles.photoItem} ${styles[`item${index + 1}`]}`}>
              <img src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;