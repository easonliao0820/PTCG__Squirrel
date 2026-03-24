import React, { useState, useEffect } from 'react';
import styles from '../../styles/pages/CalendarHistory.module.scss';

const CalendarHistory = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // 篩選與搜尋狀態
  const [filterYear, setFilterYear] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/calendar');
        if (!response.ok) {
          throw new Error('無法取得行事曆資料');
        }
        const data = await response.json();
        setCalendars(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendars();
  }, []);

  // 取得不重複的年份與月份供下拉選單使用
  const availableYears = [...new Set(calendars.map(c => c.year))].sort((a, b) => b - a);
  const availableMonths = [...new Set(calendars.map(c => c.month))].sort((a, b) => a - b);

  // 根據選擇進行篩選
  const filteredCalendars = calendars.filter(cal => {
    const matchYear = filterYear === 'All' || cal.year.toString() === filterYear;
    const matchMonth = filterMonth === 'All' || cal.month.toString() === filterMonth;
    return matchYear && matchMonth;
  });

  if (loading) return <div className={styles.loading}>正在載入歷年行事曆...</div>;
  if (error) return <div className={styles.error}>出錯了：{error}</div>;

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>歷年行事曆回顧</h2>

      {/* 搜尋與篩選區 (參考 PlayPage) */}
      <div className={styles.searchContainer}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>年份：</span>
            <select className={styles.selectBox} value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="All">全部年份</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year} 年</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>月份：</span>
            <select className={styles.selectBox} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option value="All">全部月份</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>{String(month).padStart(2, '0')} 月</option>
              ))}
            </select>
          </div>
          {(filterYear !== 'All' || filterMonth !== 'All') && (
            <button 
              className={styles.resetBtn} 
              onClick={() => { setFilterYear('All'); setFilterMonth('All'); }}
            >
              重設篩選
            </button>
          )}
        </div>
      </div>
      
      {filteredCalendars.length === 0 ? (
        <div className={styles.noData}>找不到符合篩選條件的行事曆。</div>
      ) : (
        <div className={styles.calendarGrid}>
          {filteredCalendars.map((cal) => (
            <div 
              key={cal.id} 
              className={styles.calendarCard}
              onClick={() => setSelectedImage(cal.imageUrl)}
            >
              <div className={styles.imageWrapper}>
                <img src={cal.imageUrl} alt={`${cal.year}年${cal.month}月行事曆`} loading="lazy" />
                <div className={styles.imageOverlay}>
                  <span className={styles.zoomIcon}>🔍</span>
                </div>
              </div>
              <div className={styles.cardInfo}>
                <p className={styles.date}>{cal.year}年 {String(cal.month).padStart(2, '0')}月</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Size Image Modal */}
      {selectedImage && (
        <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage} alt="全尺寸行事曆" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarHistory;
