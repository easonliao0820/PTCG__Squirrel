import { useState, useEffect } from 'react';
import styles from '../styles/components/BackToTop.module.scss';
import { FaChevronUp } from 'react-icons/fa'; // Assuming react-icons is used, if not we'll use a simple icon

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 當捲動超過 300px 時顯示按鈕
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`${styles.backToTop} ${isVisible ? styles.show : ''}`} onClick={scrollToTop}>
      <div className={styles.iconBox}>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
      </div>
    </div>
  );
}
