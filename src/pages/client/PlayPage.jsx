import { useState, useEffect, useMemo } from 'react';
import styles from '../../styles/pages/PlayPage.module.scss';
import { AiFillClockCircle, AiOutlineUser, AiOutlineDashboard, AiOutlineTags } from "react-icons/ai";

const PlayPage = () => {
  const [games, setGames] = useState([]);
  
  // 暫存狀態 (使用者正在輸入或選擇，尚未點按點擊搜尋)
  const [inputValue, setInputValue] = useState('');
  const [tempFilters, setTempFilters] = useState({
    people: '', // 改為文字輸入
    groups: '所有組合',
    age: '所有年齡'
  });

  // 實際生效的狀態 (點擊搜尋後，畫面根據此狀態進行過濾)
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    people: '', 
    groups: '所有組合',
    age: '所有年齡'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // 將 limit 設大一點以配合前端的過濾與搜尋邏輯
        const response = await fetch('http://localhost:3000/api/board-games?limit=1000');
        if (response.ok) {
          const json = await response.json();
          setGames(json.data || []);
        }
      } catch (error) {
        console.error('Error fetching board games:', error);
      }
    };

    fetchGames();
  }, []);

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
    if (isNaN(num)) return true; // 輸入非數字不影響過濾 (或可當關鍵字)

    // 嘗試解析 2-9人, 3-6人, 2人, 4人以上 等格式
    // 匹配如 2-9, 2~9, 或單一數字 2
    const matches = rangeStr.match(/(\d+)(?:\s*[-~]\s*(\d+))?/);
    if (matches) {
      const min = parseInt(matches[1], 10);
      const max = matches[2] ? parseInt(matches[2], 10) : min;
      
      // 如果格式是 "4人以上"，則 max 設為無限大
      const isMoreThan = rangeStr.includes('以上') || rangeStr.includes('+');
      return num >= min && (isMoreThan ? true : num <= max);
    }
    
    // 如果無法解析，則使用簡單的字串包含
    return rangeStr.includes(inputNum);
  };

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // 關鍵字搜尋 (名稱或描述)
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // 人數區間判定
      const matchesPeople = isPeopleMatch(game.playerCount, activeFilters.people);
      
      // 組合過濾 (由 tags 取代原本可能的 suitableGroup)
      const matchesGroups = activeFilters.groups === '所有組合' || (game.tags && game.tags.includes(activeFilters.groups));
      
      // 年齡過濾
      const matchesAge = activeFilters.age === '所有年齡' || game.suggestedAge === activeFilters.age;

      return matchesSearch && matchesPeople && matchesGroups && matchesAge;
    });
  }, [games, searchTerm, activeFilters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const paginatedGames = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGames.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGames, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 提取組合選項 (其他改為固定)
  const groupOptions = useMemo(() => {
    const options = ['所有組合'];
    games.forEach(game => {
      if (game.tags && Array.isArray(game.tags)) {
        game.tags.forEach(tag => {
          if (!options.includes(tag)) options.push(tag);
        });
      }
    });
    return options;
  }, [games]);

  const ageOptions = ['所有年齡', '0+', '6+', '12+', '15+', '18+'];

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>搜尋店內桌遊</h2>

      {/* 搜尋區 */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <input 
            type="text" 
            placeholder="搜尋桌遊名稱或關鍵字..." 
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
            <span className={styles.filterLabel}>建議組合：</span>
            <select 
              className={styles.selectBox}
              value={tempFilters.groups}
              onChange={(e) => handleTempFilterChange('groups', e.target.value)}
            >
              {groupOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
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
        {paginatedGames.length > 0 ? (
          paginatedGames.map((game) => (
            <div key={game.id} className={styles.gameCard}>
              <div className={styles.imageBox}>
                <img src={game.imageUrl || '/images/boardgame/default.jpg'} alt={game.name} />
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
    </div>
  );
};

export default PlayPage;