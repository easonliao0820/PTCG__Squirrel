import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../styles/pages/Events.module.scss';
import { Link } from 'react-router-dom';

const Events = () => {
  const [activeId, setActiveId] = useState(null);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // 搜尋與篩選狀態
  const [tempSearch, setTempSearch] = useState('');
  const [tempYear, setTempYear] = useState('All');
  const [tempMonth, setTempMonth] = useState('All');
  const [tempCategory, setTempCategory] = useState('All');

  // 實際生效的篩選條件
  const [searchTerm, setSearchTerm] = useState('');
  const [searchYear, setSearchYear] = useState('All');
  const [searchMonth, setSearchMonth] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 設定每頁顯示的活動數量

  const categories = [
    { label: "全部標籤", name: "All", dbId: "all", id: "all" },
    { label: "一般活動", name: "一般活動", dbId: 1, id: "normal" },
    { label: "PTCG 比賽", name: "PTCG 比賽", dbId: 2, id: "ptcg" },
    { label: "桌遊/劇本殺", name: "桌遊/劇本殺", dbId: 3, id: "boardgame" },
    { label: "超人力霸王", name: "超人力霸王", dbId: 4, id: "ultra" },
    { label: "活動成果", name: "活動成果", dbId: 5, id: "result" }
  ];
  const years = ["2023", "2024", "2025", "2026", "2027"];
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          year: searchYear,
          month: searchMonth,
          classId: activeCategory === 'All' ? 'all' : categories.find(c => c.name === activeCategory)?.dbId || 'all'
        });

        const url = `http://localhost:3000/api/activities?${queryParams.toString()}`;
        console.log('Fetching:', url);
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          console.log('API Response:', json);
          setEvents(json.data || []);
          if (json.pagination) {
            setTotalPages(json.pagination.totalPages);
          }
        } else {
          console.error('API Error Response:', await res.text());
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [currentPage, searchTerm, searchYear, searchMonth, activeCategory]);

  // 互斥邏輯：打開新的會自動關閉舊的
  const handleToggle = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const handleSearch = () => {
    setSearchTerm(tempSearch);
    setSearchYear(tempYear);
    setSearchMonth(tempMonth);
    setActiveCategory(tempCategory);
    setCurrentPage(1); 
  };

  // 當分類標籤切換時，直接觸發搜尋 (與 PlayPage 同步)
  const handleCategoryChange = (catName) => {
    setTempCategory(catName);
    setActiveCategory(catName);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 產生要顯示的頁碼 (處理過多頁碼的情況，與 PlayPage 同步)
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>活動查詢</h2>

      {/* 搜尋與篩選 */}
      <div className={styles.filterSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="搜尋活動名稱..."
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className={styles.searchBtn} onClick={handleSearch}>搜尋</button>
        </div>

        <div className={styles.tagGroup}>
          <div className={styles.catTags}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.tagBtn} ${styles[cat.id]} ${tempCategory === cat.name ? styles.active : ''}`}
                style={tempCategory === cat.name ? { background: '#e99713ff', color: '#fff' } : {}}
                onClick={() => handleCategoryChange(cat.name)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 月份與年份查詢 */}
          <div className={styles.dateSelectors}>
            <select value={tempYear} onChange={(e) => setTempYear(e.target.value)}>
              <option value="All">全部年份</option>
              {years.map(y => <option key={y} value={y}>{y} 年</option>)}
            </select>
            <select value={tempMonth} onChange={(e) => setTempMonth(e.target.value)}>
              <option value="All">全部月份</option>
              {months.map(m => <option key={m} value={m}>{m} 月</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.eventList}>
        {loading && <div style={{ textAlign: 'center', padding: '50px' }}>載入中...</div>}
        {!loading && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>找不到符合條件的活動。</div>
        )}
        {events.map((event, index) => {
          return (
            <div key={event.id} className={`${styles.eventItem} ${activeId === event.id ? styles.isOpen : ''}`}>
              <div className={styles.eventHeader} onClick={() => handleToggle(event.id)}>
                <span className={styles.title}>{event.title}</span>
                <div className={styles.headerRight}>
                  <span className={styles.time}>活動日期：{event.startAt} ~ {event.endAt ? event.endAt : '未定 / 發完為止'}</span>
                  <span className={styles.arrow}>{activeId === event.id ? '▲' : '▼'}</span>
                </div>
              </div>
              <div className={styles.eventBody}>
                <div className={`${styles.contentLayout} ${event.style == 0 ? styles.layoutType2 : ''}`}>

                  {event.style == 0 && (
                    <div className={styles.imageCol}>
                      {event.imageUrls && event.imageUrls.length > 0 ? (
                        event.imageUrls.map((url, i) => <img key={i} src={url} alt="活動海報" style={{ maxWidth: '100%', borderRadius: '8px' }} />)
                      ) : (
                        <div className={styles.imgPlaceholder}>無海報</div>
                      )}
                    </div>
                  )}

                  <div className={styles.textCol}>
                    <div className={styles.mainText} style={{ whiteSpace: 'pre-wrap' }}>
                      {event.content}
                      {event.url && (
                        <div style={{ marginTop: '15px' }}>
                          <a href={event.url} target="_blank" rel="noreferrer" style={{ color: '#007BFF', textDecoration: 'underline' }}>前往活動連結／報名資訊</a>
                        </div>
                      )}
                    </div>
                    <div className={styles.dateBar}>發布日期：{event.startAt} · 松鼠窩</div>
                  </div>

                  {/* 文左圖右 (Layout 2) */}
                  {event.style === 1 && (
                    <div className={styles.imageCol}>
                      {event.imageUrls && event.imageUrls.length > 0 ? (
                        event.imageUrls.map((url, i) => <img key={i} src={url} alt="活動海報" style={{ maxWidth: '100%', borderRadius: '8px' }} />)
                      ) : (
                        <div className={styles.imgPlaceholder}>無海報</div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 分頁按鈕 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span
            onClick={() => goToPage(currentPage - 1)}
            style={{ opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}
          >
            &lt;
          </span>

          {visiblePages.map((num, idx) => (
            <span
              key={idx}
              className={currentPage === num ? styles.active : ''}
              onClick={() => typeof num === 'number' && goToPage(num)}
              style={{ cursor: typeof num === 'number' ? 'pointer' : 'default' }}
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
    </div>
  );
};

export default Events;