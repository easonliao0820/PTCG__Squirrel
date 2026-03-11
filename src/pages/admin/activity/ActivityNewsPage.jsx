import { useEffect, useMemo, useState } from 'react'
import '../../../styles/pages/admin/activity/ActivityNewsPage.scss'

const STORAGE_KEY = 'esn_activity_all'



const categoryConfig = {
  general: { label: '一般活動', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  ptcg: { label: 'PTCG 比賽', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  ultraman: { label: '超人力霸王', color: 'bg-red-100 text-red-800 border-red-200' },
  result: { label: '活動成果', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
}

const layoutOptions = [
  { value: 'layout-left', label: '經典圖左', desc: '圖左文右' },
  { value: 'layout-right', label: '焦點圖右', desc: '文左圖右' },
  { value: 'layout-top', label: '大圖置頂', desc: '大圖置頂' },
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function ActivityNewsPage() {
  const [items, setItems] = useState(load)
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    category: 'general',
    layout: 'layout-left',
    startAt: '',
    endAt: '',
  })

  useEffect(() => { save(items) }, [items])

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return items.filter((i) => {
      const matchCategory = filter === 'all' || i.category === filter
      if (!matchCategory) return false
      return !keyword || i.title.toLowerCase().includes(keyword) || i.content.toLowerCase().includes(keyword)
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [items, filter, search])

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' && setForm(f => ({ ...f, imageUrl: reader.result }))
    reader.readAsDataURL(file)
  }

  const submit = () => {
    if (!form.title.trim()) return alert('請輸入標題')
    const now = new Date().toISOString()
    const newItem = { ...form, updatedAt: now }
    if (editing) {
      setItems(items.map(i => i.id === editing.id ? { ...i, ...newItem } : i))
    } else {
      setItems([{ ...newItem, id: crypto.randomUUID(), createdAt: now }, ...items])
    }
    setIsCreating(false); setEditing(null)
  }

  // --- 渲染組件：編輯時的版面預覽 ---
  const LayoutPreview = ({ item }) => {
    const config = categoryConfig[item.category] || categoryConfig.general
    const period = item.startAt || item.endAt ? `${item.startAt || ''} ~ ${item.endAt || ''}` : null

    return (
      <div className={`preview-card ${item.layout}`}>
        {item.imageUrl && (
          <div className={`preview-img-wrapper ${item.layout === 'layout-top' ? 'top' : 'side'}`}>
            <img src={item.imageUrl} alt="" />
          </div>
        )}
        <div className="preview-content">
          <span className={`badge ${config.color.split(' ').join(' ')}`}>
            {config.label}
          </span>
          <h3 className="title">{item.title || '尚未輸入標題'}</h3>
          {period && <p className="period">📅 {period}</p>}
          <p className="desc">{item.content || '尚未輸入內容描述...'}</p>
        </div>
      </div>
    )
  }

  // --- 渲染組件：列表項目 ---
  const AdminListItem = ({ item }) => {
    const config = categoryConfig[item.category] || categoryConfig.general
    const period = item.startAt || item.endAt ? `${item.startAt || ''} ~ ${item.endAt || ''}` : null

    return (
      <div className="list-item-card">
        <div className="item-content">
          <div className="item-meta">
            <span className={`badge ${config.color.split(' ').join(' ')}`}>
              {config.label}
            </span>
            <span className="date-updated">更新於 {new Date(item.updatedAt).toLocaleDateString()}</span>
          </div>
          <h3 className="item-title">{item.title}</h3>
          {period && <p className="item-period">📅 {period}</p>}
          <p className="item-desc">{item.content}</p>
        </div>

        {item.imageUrl && (
          <div className="item-thumbnail">
            <img src={item.imageUrl} alt="" />
          </div>
        )}

        <div className="item-actions">
          <button
            onClick={() => { setEditing(item); setForm({ ...item, startAt: item.startAt || '', endAt: item.endAt || '' }) }}
            className="action-btn edit"
            title="編輯"
          >
            ✏️
          </button>
          <button
            onClick={() => confirm('確定要刪除？') && setItems(items.filter(i => i.id !== item.id))}
            className="action-btn delete"
            title="刪除"
          >
            🗑️
          </button>
        </div>
      </div>
    )
  }

  const showForm = isCreating || editing

  return (
    <div className="activity-news-page">
      <div className="page-header-container">
        <div>
          <h1 className="page-title">活動消息發佈</h1>
          <p className="page-subtitle">統一管理店內公告與比賽紀錄。</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setIsCreating(true); setEditing(null); setForm({ ...form, title: '', content: '', imageUrl: '' }) }}
            className="btn-create"
          >
            + 撰寫新消息
          </button>
        )}
      </div>

      {showForm ? (
        <div className="editor-grid">
          <div className="form-panel">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">訊息分類</label>
                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">版面樣式</label>
                <div className="layout-options">
                  {layoutOptions.map(opt => (
                    <button key={opt.value} onClick={() => setForm(f => ({ ...f, layout: opt.value }))} className={`layout-btn ${form.layout === opt.value ? 'active' : ''}`}>{opt.label}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group title-group">
              <label className="form-label">訊息標題</label>
              <input type="text" className="form-input" placeholder="標題..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>

            <div className="form-row">
              <div className="form-group"><label className="form-label">日期(起)</label><input type="date" className="form-input" value={form.startAt} onChange={e => setForm(f => ({ ...f, startAt: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">日期(迄)</label><input type="date" className="form-input" value={form.endAt} onChange={e => setForm(f => ({ ...f, endAt: e.target.value }))} /></div>
            </div>

            <div className="form-group">
              <label className="form-label">詳情內容</label>
              <textarea className="form-textarea" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">活動配圖</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="file-input" />
            </div>

            <div className="form-actions">
              <button onClick={submit} className="btn-save">儲存變更</button>
              <button onClick={() => { setIsCreating(false); setEditing(null) }} className="btn-cancel">取消</button>
            </div>
          </div>

          <div className="preview-panel">
            <label className="preview-label">版面樣式即時預覽 (前台視角)</label>
            <div className="preview-container">
              <LayoutPreview item={form} />
            </div>
            <p className="preview-note">※ 列表呈現固定為統一格式，此處僅模擬前台呈現樣式。</p>
          </div>
        </div>
      ) : (
        <>
          <div className="list-controls">
            <div className="filter-tabs">
              <button onClick={() => setFilter('all')} className={`tab-btn ${filter === 'all' ? 'active' : ''}`}>全部</button>
              {Object.entries(categoryConfig).map(([k, v]) => (
                <button key={k} onClick={() => setFilter(k)} className={`tab-btn ${filter === k ? 'active' : ''}`}>{v.label}</button>
              ))}
            </div>
            <div className="search-box">
              <input type="text" placeholder="搜尋標題..." className="search-input" value={search} onChange={e => setSearch(e.target.value)} />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="list-container">
            {filteredItems.length === 0 ? (
              <div className="empty-state">尚未有任何活動。</div>
            ) : (
              filteredItems.map(item => <AdminListItem key={item.id} item={item} />)
            )}
          </div>
        </>
      )}
    </div>
  )
}