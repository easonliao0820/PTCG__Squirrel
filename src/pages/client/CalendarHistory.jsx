import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../styles/pages/CalendarHistory.module.scss';

const CalendarHistory = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // 暫存篩選狀態 (下拉選單點選，但未點擊搜尋)
  const [tempYear, setTempYear] = useState('All');
  const [tempMonth, setTempMonth] = useState('All');

  // 實際生效的篩選狀態 (點擊搜尋後生效)
  const [filterYear, setFilterYear] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        // 將 limit 設大一點以配合前端的全載入過濾與分頁
        const response = await fetch('/api/calendar?limit=1000');
        if (!response.ok) {
          throw new Error('無法取得行事曆資料');
        }
        const json = await response.json();
        // 後端 API 回傳格式為 { data: [...], pagination: {...} }
        setCalendars(json.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendars();
  }, []);

  // 點擊搜尋按鈕
  const handleSearch = () => {
    setFilterYear(tempYear);
    setFilterMonth(tempMonth);
    setCurrentPage(1);
  };

  // 重設篩選 (立即生效)
  const handleReset = () => {
    setTempYear('All');
    setTempMonth('All');
    setFilterYear('All');
    setFilterMonth('All');
    setCurrentPage(1);
  };

  // 取得不重複的年份與月份供下拉選單使用
  const availableYears = [...new Set(calendars?.map(c => c.year))].sort((a, b) => b - a);
  const availableMonths = [...new Set(calendars?.map(c => c.month))].sort((a, b) => a - b);

  // 根據選擇進行篩選
  const filteredCalendars = useMemo(() => {
    return calendars?.filter(cal => {
      const matchYear = filterYear === 'All' || cal.year.toString() === filterYear;
      const matchMonth = filterMonth === 'All' || cal.month.toString() === filterMonth;
      return matchYear && matchMonth;
    });
  }, [calendars, filterYear, filterMonth]);

  // 分頁邏輯
  const totalPages = Math.ceil((filteredCalendars?.length || 0) / itemsPerPage);
  const paginatedCalendars = useMemo(() => {
    if (!filteredCalendars) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCalendars.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCalendars, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) return <div className={styles.loading}>正在載入歷年行事曆...</div>;
  if (error) return <div className={styles.error}>出錯了：{error}</div>;

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>歷年行事曆回顧</h2>

      {/* 搜尋與篩選區 */}
      <div className={styles.searchContainer}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>年份：</span>
            <select className={styles.selectBox} value={tempYear} onChange={(e) => setTempYear(e.target.value)}>
              <option value="All">全部年份</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year} 年</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>月份：</span>
            <select className={styles.selectBox} value={tempMonth} onChange={(e) => setTempMonth(e.target.value)}>
              <option value="All">全部月份</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>{String(month).padStart(2, '0')} 月</option>
              ))}
            </select>
          </div>
          
          <button className={styles.searchBtn} onClick={handleSearch}>搜尋</button>

          {(filterYear !== 'All' || filterMonth !== 'All' || tempYear !== 'All' || tempMonth !== 'All') && (
            <button className={styles.resetBtn} onClick={handleReset}>重設篩選</button>
          )}
        </div>
      </div>
      
      {filteredCalendars?.length === 0 ? (
        <div className={styles.noData}>找不到符合篩選條件的行事曆。</div>
      ) : (
        <div className={styles.calendarGrid}>
          {paginatedCalendars.map((cal) => (
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

      {/* 分頁按鈕 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span 
            onClick={() => goToPage(currentPage - 1)}
            style={{ opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}
          >
            &lt;
          </span>
          
          {pageNumbers.map(num => (
            <span 
              key={num} 
              className={currentPage === num ? styles.active : ''}
              onClick={() => goToPage(num)}
            >
              {num}
            </span>
          ))}

          <span 
            onClick={() => goToPage(currentPage + 1)}
            style={{ opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'default' : 'pointer' }}
          >
            &gt;
          </span>
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
