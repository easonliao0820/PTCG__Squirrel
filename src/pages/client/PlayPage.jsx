import { useState, useEffect, useMemo } from 'react';
import styles from '../../styles/pages/PlayPage.module.scss';
import { AiFillClockCircle, AiOutlineUser, AiOutlineDashboard, AiOutlineTags } from "react-icons/ai";

const PlayPage = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 暫存狀態 (使用者正在輸入或選擇，尚未點按點擊搜尋)

  const [inputValue, setInputValue] = useState('');
  const [tempFilters, setTempFilters] = useState({
    playType: '一般桌遊',
    people: '',
    groups: '所有組合',
    age: '所有年齡'
  });

  // 實際生效的狀態 (點擊搜尋後，畫面根據此狀態進行過濾)
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    playType: '一般桌遊',
    people: '',
    groups: '所有組合',
    age: '所有年齡'
  });

  const [totalPages, setTotalPages] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          limit: itemsPerPage,
          search: searchTerm
        });

        // 1. 抓取分頁資訊 (總頁數) - 只有當搜尋或類別改變時才需要重新計算，但這裡合併處理
        const [bgPagRes, laprPagRes] = await Promise.all([
          fetch(`/api/board-games/pagination?${queryParams.toString()}`),
          fetch(`/api/lapr/pagination?${queryParams.toString()}`)
        ]);

        let bgTotal = 0;
        let laprTotal = 0;

        if (bgPagRes.ok) {
          const json = await bgPagRes.json();
          bgTotal = json.pagination.totalItems;
        }
        if (laprPagRes.ok) {
          const json = await laprPagRes.json();
          laprTotal = json.pagination.totalItems;
        }

        // 根據類型限制計算總數
        let effectiveTotal = 0;
        if (activeFilters.playType === '') effectiveTotal = bgTotal + laprTotal;
        else if (activeFilters.playType === '一般桌遊') effectiveTotal = bgTotal;
        else if (activeFilters.playType === '劇本殺') effectiveTotal = laprTotal;

        setTotalPages(Math.ceil(effectiveTotal / itemsPerPage) || 1);

        // 2. 抓取當前頁面資料
        const dataParams = new URLSearchParams({
          page: currentPage,
          limit: activeFilters.playType === '' ? Math.ceil(itemsPerPage / 2) : itemsPerPage,
          search: searchTerm
        });

        let allGames = [];
        const fetchPromises = [];

        if (activeFilters.playType === '' || activeFilters.playType === '一般桌遊') {
          fetchPromises.push(
            fetch(`/api/board-games?${dataParams.toString()}`)
              .then(res => res.ok ? res.json() : { data: [] })
              .then(json => json.data.map(item => ({ ...item, type: '一般桌遊' })))
          );
        }

        if (activeFilters.playType === '' || activeFilters.playType === '劇本殺') {
          fetchPromises.push(
            fetch(`/api/lapr?${dataParams.toString()}`)
              .then(res => res.ok ? res.json() : { data: [] })
              .then(json => json.data.map(item => ({ 
                id: `lapr_${item.id}`,
                name: item.name,
                description: item.remark || '無簡介',
                playerCount: item.role || '無特定人數',
                playingTime: '依劇本規定',
                suggestedAge: '建議15+',
                imageUrl: null,
                tags: item.tags || [],
                type: '劇本殺'
              })))
          );
        }

        const results = await Promise.all(fetchPromises);
        allGames = results.flat();

        setGames(allGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [currentPage, searchTerm, activeFilters.playType]);

  // 類型選擇的處理函式：直接更新生效篩選 + 抓取對應標籤 (0=桌遊, 1=劇本殺)
  const handleTypeChange = (newType) => {
    // 同時更新 temp 與 active，讓資料立即重新抓取
    setTempFilters(prev => ({ ...prev, playType: newType, groups: '所有組合' }));
    setActiveFilters(prev => ({ ...prev, playType: newType, groups: '所有組合' }));
    setCurrentPage(1);
  };

  // 點擊搜尋按鈕
  const handleSearch = () => {
    setSearchTerm(inputValue);
    setActiveFilters({ ...tempFilters });
    setCurrentPage(1);
  };

  const handleTempFilterChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  // 輔助函式：判斷人數是否在區間內
  const isPeopleMatch = (rangeStr, inputNum) => {
    if (!inputNum) return true; // 未輸入則不限
    if (!rangeStr) return false;

    const num = parseInt(inputNum, 10);
    if (isNaN(num)) return true;
    const matches = rangeStr.match(/(\d+)(?:\s*[-~]\s*(\d+))?/);
    if (matches) {
      const min = parseInt(matches[1], 10);
      const max = matches[2] ? parseInt(matches[2], 10) : min;

      // 如果格式是 "4人以上"，則 max 設為無限大
      const isMoreThan = rangeStr.includes('以上') || rangeStr.includes('+');
      return num >= min && (isMoreThan ? true : num <= max);
    }
    return rangeStr.includes(inputNum);
  };

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // 由於後端已經處理了 playType 與 search，這裡只需要處理剩餘的前端過濾 (或您可以之後再補後端)
      // 注意：如果您希望完全後端過濾，請將 people, age 等也加入 query

      const matchesType = activeFilters.playType === '' || game.type === activeFilters.playType;
      const matchesPeople = isPeopleMatch(game.playerCount, activeFilters.people);
      const matchesGroups = activeFilters.groups === '所有組合' || (game.tags && game.tags.includes(activeFilters.groups));
      const matchesAge = activeFilters.age === '所有年齡' || game.suggestedAge === activeFilters.age;

      return matchesType && matchesPeople && matchesGroups && matchesAge;
    });
  }, [games, activeFilters]);

  // 分頁切片邏輯 (現在由後端提供 20 筆，前端只需要過濾後的這 20 筆即可)
  const paginatedGames = filteredGames;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 產生要顯示的頁碼 (處理過多頁碼的情況)
  const getVisiblePages = () => {
    const delta = 2; // 當前頁碼前後顯示幾頁
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const visiblePages = getVisiblePages();

  // 組合選項：直接從目前類型的 games 中對應的 tags
  // 這樣不管 tag 表的 class 欄位是否正確，都能正確展示
  const groupOptions = useMemo(() => {
    if (!activeFilters.playType) return ['所有組合'];
    const tagSet = new Set();
    games.forEach(game => {
      if (game.tags && Array.isArray(game.tags)) {
        game.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return ['所有組合', ...Array.from(tagSet).sort()];
  }, [games, activeFilters.playType]);

  const ageOptions = ['所有年齡', '0+', '6+', '12+', '15+', '18+'];

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>搜尋店內遊玩品項</h2>

      {/* 搜尋區 */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="搜尋名稱或關鍵字..."
            className={styles.searchInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className={styles.searchBtn} onClick={handleSearch}>搜尋</button>
        </div>

        {/* 下拉選單區 */}
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>類型：</span>
            <select
              className={styles.selectBox}
              value={tempFilters.playType}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="一般桌遊">一般桌遊</option>
              <option value="劇本殺">劇本殺</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>建議組合：</span>
            <select
              className={styles.selectBox}
              value={tempFilters.groups}
              onChange={(e) => handleTempFilterChange('groups', e.target.value)}
              disabled={!tempFilters.playType} // 未選類型前禁用
              style={{ opacity: !tempFilters.playType ? 0.5 : 1, cursor: !tempFilters.playType ? 'not-allowed' : 'pointer' }}
            >
              {!tempFilters.playType ? (
                <option>請先選擇類型</option>
              ) : (
                groupOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
              )}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>指定人數：</span>
            <input
              type="text"
              placeholder="例如: 6"
              className={styles.selectBox} // 沿用樣式
              style={{ width: '80px' }}
              value={tempFilters.people}
              onChange={(e) => handleTempFilterChange('people', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>建議年齡：</span>
            <select
              className={styles.selectBox}
              value={tempFilters.age}
              onChange={(e) => handleTempFilterChange('age', e.target.value)}
            >
              {ageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 桌遊卡片網格 */}
      <div className={styles.gameGrid}>
        {isLoading ? (
          <div className={styles.noResults}>讀取中...</div>
        ) : paginatedGames.length > 0 ? (
          paginatedGames.map((game) => (
            <div key={game.id} className={styles.gameCard}>
              <div className={styles.imageBox}>
                <img src={game.imageUrl || '/images/noimg.png'} alt={game.name} />
              </div>
              <div className={styles.infoBox}>
                <h3 className={styles.gameName}>{game.name}</h3>
                <p className={styles.gameDesc}>{game.description}</p>
                <div className={styles.tagGrid}>
                  <div className={styles.tag}><AiFillClockCircle /> {game.playingTime}</div>
                  <div className={styles.tag}><AiOutlineTags /> {game.tags && game.tags.length > 0 ? game.tags.join(', ') : '無標籤'}</div>
                  <div className={styles.tag}><AiOutlineUser /> {game.playerCount}</div>
                  <div className={styles.tag}><AiOutlineDashboard /> {game.suggestedAge}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>找不到符合條件的桌遊</div>
        )}
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

export default PlayPage;