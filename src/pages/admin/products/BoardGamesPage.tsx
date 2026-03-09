import { useState, useEffect, useMemo } from 'react'
import './BoardGamesPage.scss'

const STORAGE_KEY = 'esn_boardgames_v2'

export interface BoardGameItem {
  id: string
  name: string
  description: string
  playingTime: string
  suggestedAge: string
  playerCount: string
  suitableGroup: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

function load(): BoardGameItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function save(data: BoardGameItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function BoardGamesPage() {
  const [items, setItems] = useState<BoardGameItem[]>(load)
  const [editing, setEditing] = useState<BoardGameItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    playingTime: '',
    suggestedAge: '',
    playerCount: '',
    suitableGroup: '',
    imageUrl: '',
  })

  useEffect(() => { save(items) }, [items])

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return items.filter((item) => 
      !keyword || 
      item.name.toLowerCase().includes(keyword) || 
      item.description?.toLowerCase().includes(keyword)
    ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [items, search])

  const openCreate = () => {
    setForm({ name: '', description: '', playingTime: '', suggestedAge: '', playerCount: '', suitableGroup: '', imageUrl: '' })
    setEditing(null)
    setIsCreating(true)
  }

  const openEdit = (item: BoardGameItem) => {
    setForm({
      name: item.name,
      description: item.description || '',
      playingTime: item.playingTime,
      suggestedAge: item.suggestedAge,
      playerCount: item.playerCount,
      suitableGroup: item.suitableGroup,
      imageUrl: item.imageUrl,
    })
    setEditing(item)
    setIsCreating(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === 'string' && setForm(f => ({ ...f, imageUrl: reader.result as string }))
    reader.readAsDataURL(file)
  }

  const submit = () => {
    if (!form.name.trim()) return alert('請輸入桌遊名稱')
    const now = new Date().toISOString()

    if (editing) {
      setItems(items.map(i => i.id === editing.id ? { ...i, ...form, updatedAt: now } : i))
    } else {
      setItems([{ id: crypto.randomUUID(), ...form, createdAt: now, updatedAt: now }, ...items])
    }
    setIsCreating(false); setEditing(null)
  }

  const showForm = isCreating || editing

  return (
    <div className="board-games-page">
      <div className="page-header">
        <div>
          <h1 className="title">桌遊款式管理</h1>
          <p className="subtitle">建立館內桌遊清單，提供玩家選遊戲時的參考指標。</p>
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

              <div className="form-grid-4">
                <div className="form-group">
                  <label className="form-label">⏱️ 遊玩時間</label>
                  <input value={form.playingTime} onChange={(e) => setForm(f => ({ ...f, playingTime: e.target.value }))} className="form-input" placeholder="30-45 分鐘" />
                </div>
                <div className="form-group">
                  <label className="form-label">🎂 建議年齡</label>
                  <input value={form.suggestedAge} onChange={(e) => setForm(f => ({ ...f, suggestedAge: e.target.value }))} className="form-input" placeholder="10 歲以上" />
                </div>
                <div className="form-group">
                  <label className="form-label">👥 建議人數</label>
                  <input value={form.playerCount} onChange={(e) => setForm(f => ({ ...f, playerCount: e.target.value }))} className="form-input" placeholder="2-4 人" />
                </div>
                <div className="form-group">
                  <label className="form-label">🏷️ 適合族群</label>
                  <input value={form.suitableGroup} onChange={(e) => setForm(f => ({ ...f, suitableGroup: e.target.value }))} className="form-input" placeholder="新手入門" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">桌遊封面</label>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="file-input" />
              </div>

              <div className="form-actions">
                <button onClick={submit} className="btn-submit">儲存桌遊資訊</button>
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
                    <h4 className="preview-title">{form.name || '桌遊名稱'}</h4>
                    <p className="preview-desc">
                      {form.description || '這裡將會顯示這款桌遊的特色說明與玩法簡介...'}
                    </p>
                    <div className="preview-stats">
                      <div className="stat">⏱️ {form.playingTime || '--'}</div>
                      <div className="stat">👥 {form.playerCount || '--'}</div>
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
            目前沒有符合條件的桌遊
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
                  <div className="stat-label">Time</div>
                  <div className="stat-value">{item.playingTime}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Age</div>
                  <div className="stat-value">{item.suggestedAge}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Players</div>
                  <div className="stat-value">{item.playerCount}</div>
                </div>
              </div>

              <div className="card-actions">
                <button onClick={() => openEdit(item)} className="btn-edit">
                  Edit Details
                </button>
                <button onClick={() => confirm('確定刪除？') && setItems(items.filter(i => i.id !== item.id))} className="btn-delete">
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