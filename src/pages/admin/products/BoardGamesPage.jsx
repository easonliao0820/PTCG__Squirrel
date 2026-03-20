import { useState, useEffect, useMemo, useRef } from 'react'
import '../../../styles/pages/admin/products/BoardGamesPage.scss'

const parsePlayTime = (str) => {
  if (!str) return { min: '', max: '', unit: '分鐘' };
  const match = str.match(/(?:(\d+)-)?(\d+)\s*(分鐘|小時)?/);
  if (match) {
    if (match[1]) return { min: match[1], max: match[2], unit: match[3] || '分鐘' };
    return { min: '', max: match[2], unit: match[3] || '分鐘' };
  }
  return { min: '', max: '', unit: '分鐘' };
};

const parsePlayerCount = (str) => {
  if (!str) return { min: '', op: '~', max: '' };
  const matchRange = str.match(/(\d+)[\-~](\d+)\s*人?/);
  if (matchRange) return { min: matchRange[1], op: '~', max: matchRange[2] };
  const matchExact = str.match(/(\d+)\s*人?/);
  if (matchExact) return { min: '', op: '=', max: matchExact[1] };
  return { min: '', op: '~', max: '' };
};

const parseAge = (str) => {
  const valid = ['0+', '6+', '12+', '15+', '18+'];
  if (valid.includes(str)) return str;
  const numMatch = str?.match(/\d+/);
  if (numMatch) {
    const n = Number(numMatch[0]);
    if (n >= 18) return '18+';
    if (n >= 15) return '15+';
    if (n >= 12) return '12+';
    if (n >= 6) return '6+';
  }
  return '0+';
};

export function BoardGamesPage() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef(null)

  const defaultForm = {
    name: '',
    description: '',
    playMin: '',
    playMax: '',
    playUnit: '分鐘',
    ageLevel: '0+',
    playerMin: '',
    playerOp: '~',
    playerMax: '',
    suitableGroup: '',
    imageUrl: '',
    uploadFile: null,
  }

  const [form, setForm] = useState(defaultForm)

  const fetchGames = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/games')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (err) {
      console.error('Failed to fetch board games:', err)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return items.filter((item) =>
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.description?.toLowerCase().includes(keyword)
    )
  }, [items, search])

  const openCreate = () => {
    setForm(defaultForm)
    setEditing(null)
    setIsCreating(true)
  }

  const openEdit = (item) => {
    const parsedTime = parsePlayTime(item.playingTime)
    const parsedPlayers = parsePlayerCount(item.playerCount)
    const parsedAge = parseAge(item.suggestedAge)

    setForm({
      id: item.id,
      name: item.name,
      description: item.description || '',
      suitableGroup: item.suitableGroup || '',
      imageUrl: item.imageUrl || '',
      uploadFile: null,
      playMin: parsedTime.min,
      playMax: parsedTime.max,
      playUnit: parsedTime.unit,
      ageLevel: parsedAge,
      playerMin: parsedPlayers.min,
      playerOp: parsedPlayers.op,
      playerMax: parsedPlayers.max,
    })
    setEditing(item)
    setIsCreating(true)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm(f => ({ ...f, uploadFile: file, imageUrl: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const submit = async () => {
    if (!form.name.trim()) return alert('請輸入桌遊名稱')
    setIsLoading(true)

    let playingTime = '';
    if (form.playMin && form.playMax) {
      playingTime = `${form.playMin}-${form.playMax} ${form.playUnit}`;
    } else if (form.playMax) {
      playingTime = `${form.playMax} ${form.playUnit}`;
    } else {
      playingTime = `--`;
    }

    let playerCount = '';
    if (form.playerOp === '~') {
      if (form.playerMin && form.playerMax) {
        playerCount = `${form.playerMin}-${form.playerMax} 人`;
      } else {
        playerCount = `${form.playerMax || form.playerMin || ''} 人`;
      }
    } else {
      if (form.playerMax) {
        playerCount = `${form.playerMax} 人`;
      } else {
        playerCount = `--`;
      }
    }

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('time', playingTime)
    formData.append('age', form.ageLevel)
    formData.append('people', playerCount)
    formData.append('groups', form.suitableGroup)
    formData.append('content', form.description)
    if (form.uploadFile) formData.append('image', form.uploadFile)

    try {
      let res;
      if (editing) {
        res = await fetch(`http://localhost:3000/api/games/${editing.id}`, {
          method: 'PUT',
          body: formData
        })
      } else {
        res = await fetch('http://localhost:3000/api/games', {
          method: 'POST',
          body: formData
        })
      }

      if (res.ok) {
        alert(editing ? '更新成功！' : '建立成功！')
        setIsCreating(false)
        setEditing(null)
        setForm(defaultForm)
        fetchGames()
      } else {
        const data = await res.json()
        alert('儲存失敗：' + data.message)
      }
    } catch (err) {
      console.error('Submit failed:', err)
      alert('儲存失敗！')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('確定要刪除？')) return
    try {
      const res = await fetch(`http://localhost:3000/api/games/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchGames()
      } else {
        alert('刪除失敗！')
      }
    } catch (err) {
      console.error('Delete failed:', err)
      alert('刪除失敗！')
    }
  }

  const showForm = isCreating || editing

  // Preview compilers
  let previewPlayTime = '';
  if (form.playMin && form.playMax) previewPlayTime = `${form.playMin}~${form.playMax} ${form.playUnit}`;
  else if (form.playMax) previewPlayTime = `${form.playMax} ${form.playUnit}`;

  let previewPlayerCount = '';
  if (form.playerOp === '~') previewPlayerCount = `${form.playerMin && form.playerMax ? `${form.playerMin}~${form.playerMax}` : (form.playerMax || form.playerMin || '')} 人`;
  else if (form.playerOp === '=') previewPlayerCount = `${form.playerMax || ''} 人`;

  return (
    <div className="board-games-page">
      <div className="page-header">
        <div>
          <h1 className="title">桌遊款式管理</h1>
          <p className="subtitle">連接資料庫 `game` 表單，提供玩家選遊戲時的參考指標。</p>
        </div>
        {!showForm && (
          <button onClick={openCreate} className="btn-create">
            + 新增桌遊
          </button>
        )}
      </div>

      {showForm && (
        <div className="editor-panel">
          <h2 className="editor-header">
            {editing ? '📝 編輯桌遊資訊' : '🎲 新增桌遊項目'}
          </h2>

          <div className="editor-layout">
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">桌遊名稱</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="form-input"
                  placeholder="例如：璀璨寶石 (Splendor)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">桌遊特色說明</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="form-textarea"
                  placeholder="描述遊戲玩法、背景或是推薦原因..."
                />
              </div>

              <div className="form-grid-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label">⏱️ 遊玩時間</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="number" min="1" value={form.playMin} onChange={(e) => setForm(f => ({ ...f, playMin: e.target.value }))} className="form-input" style={{ width: '60px' }} placeholder="起" />
                    <span>~</span>
                    <input type="number" min="1" value={form.playMax} onChange={(e) => setForm(f => ({ ...f, playMax: e.target.value }))} className="form-input" style={{ width: '60px' }} placeholder="迄" />
                    <select value={form.playUnit} onChange={(e) => setForm(f => ({ ...f, playUnit: e.target.value }))} className="form-select" style={{ width: '80px', padding: '0.5rem' }}>
                      <option value="min">min</option>
                      <option value="hr">hr</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🎂 建議年齡</label>
                  <select value={form.ageLevel} onChange={(e) => setForm(f => ({ ...f, ageLevel: e.target.value }))} className="form-select">
                    <option value="0+">0+</option>
                    <option value="6+">6+</option>
                    <option value="12+">12+</option>
                    <option value="15+">15+</option>
                    <option value="18+">18+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">👥 建議人數</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {form.playerOp === '~' ? (
                      <input type="number" min="1" value={form.playerMin} onChange={(e) => setForm(f => ({ ...f, playerMin: e.target.value }))} className="form-input" style={{ width: '60px' }} placeholder="起" />
                    ) : null}
                    <select value={form.playerOp} onChange={(e) => setForm(f => ({ ...f, playerOp: e.target.value }))} className="form-select" style={{ width: '50px', padding: '0.5rem' }}>
                      <option value="~">~</option>
                      <option value="=">=</option>
                    </select>
                    <input type="number" min="1" value={form.playerMax} onChange={(e) => setForm(f => ({ ...f, playerMax: e.target.value }))} className="form-input" style={{ width: '60px' }} placeholder={form.playerOp === '=' ? "數" : "迄"} />
                    <span>人</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🏷️ 適合族群</label>
                  <input value={form.suitableGroup} onChange={(e) => setForm(f => ({ ...f, suitableGroup: e.target.value }))} className="form-input" placeholder="新手入門" />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">桌遊封面</label>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="file-input" />
              </div>

              <div className="form-actions">
                <button onClick={submit} className="btn-submit" disabled={isLoading}>{isLoading ? '儲存中...' : '儲存桌遊資訊'}</button>
                <button onClick={() => { setIsCreating(false); setEditing(null); }} className="btn-cancel">取消</button>
              </div>
            </div>

            <div className="preview-section">
              <div className="preview-wrapper">
                <span className="preview-label">Live Preview</span>
                <div className="preview-card">
                  <div className="preview-img-container">
                    {form.imageUrl ? <img src={form.imageUrl} alt="" /> : <div className="no-img">No Image</div>}
                  </div>
                  <div className="preview-content">
                    <div className="preview-header-meta">
                      <span className="group-badge">{form.suitableGroup || '適合族群'}</span>
                      <span className="age-badge">🎂 {form.ageLevel}</span>
                    </div>
                    <h4 className="preview-title">{form.name || '桌遊名稱'}</h4>
                    <p className="preview-desc">
                      {form.description || '這裡將會顯示這款桌遊的特色說明與玩法簡介...'}
                    </p>
                    <div className="preview-stats">
                      <div className="stat">⏱️ {previewPlayTime || '--'}</div>
                      <div className="stat">👥 {previewPlayerCount || '--'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <div className="search-container">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            placeholder="搜尋名稱或特色說明…"
          />
          <span className="search-icon">🔍</span>
        </div>
      )}

      <div className="game-grid">
        {filteredItems.length === 0 && !showForm && (
          <div className="empty-state">
            目前沒有建立任何桌遊
          </div>
        )}
        {filteredItems.map((item) => (
          <div key={item.id} className="game-card">
            <div className="card-image-wrapper">
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
              <div className="group-badge">{item.suitableGroup}</div>
            </div>

            <div className="card-content">
              <h3 className="card-title">{item.name}</h3>

              <p className="card-desc">
                {item.description || '暫無說明內容'}
              </p>

              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-label">時間</div>
                  <div className="stat-value">{item.playingTime}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">年齡</div>
                  <div className="stat-value">{item.suggestedAge}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">人數</div>
                  <div className="stat-value">{item.playerCount}</div>
                </div>
              </div>

              <div className="card-actions">
                <button onClick={() => openEdit(item)} className="btn-edit">
                  編輯內容
                </button>
                <button onClick={() => handleDelete(item.id)} className="btn-delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}