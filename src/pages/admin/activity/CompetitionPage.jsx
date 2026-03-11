import { useState, useEffect } from 'react'
import '../../../styles/pages/admin/activity/CompetitionPage.scss'

const STORAGE_KEY = 'esn_competition'



const typeLabels = {
  ptcg: 'PTCG',
  ultraman: '超人力霸王',
  result: '活動成果',
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function CompetitionPage() {
  const [items, setItems] = useState(load)
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ type: 'ptcg', title: '', content: '', imageUrl: '' })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    save(items)
  }, [items])

  const filtered =
    filter === 'all'
      ? items
      : items.filter((i) => i.type === filter)

  const openCreate = (type) => {
    setForm({
      type: type ?? 'ptcg',
      title: '',
      content: '',
      imageUrl: '',
    })
    setEditing(null)
    setIsCreating(true)
  }

  const openEdit = (item) => {
    setForm({
      type: item.type,
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl,
    })
    setEditing(item)
    setIsCreating(false)
  }

  const closeForm = () => {
    setEditing(null)
    setIsCreating(false)
  }

  const submit = () => {
    if (!form.title.trim()) return
    const now = new Date().toISOString()
    if (editing) {
      setItems(
        items.map((i) =>
          i.id === editing.id
            ? {
              ...i,
              ...form,
              imageUrl: form.imageUrl.trim() || i.imageUrl,
              updatedAt: now,
            }
            : i
        )
      )
    } else {
      setItems([
        {
          id: crypto.randomUUID(),
          type: form.type,
          title: form.title,
          content: form.content,
          imageUrl: form.imageUrl.trim(),
          createdAt: now,
          updatedAt: now,
        },
        ...items,
      ])
    }
    closeForm()
  }

  const remove = (id) => {
    if (confirm('確定要刪除？')) {
      setItems(items.filter((i) => i.id !== id))
      closeForm()
    }
  }

  const showForm = isCreating || editing

  return (
    <div className="competition-page">
      <div className="page-header">
        <h1 className="title">比賽消息</h1>
        <p className="subtitle">
          比賽相關活動：PTCG、超人力霸王、活動成果。可編輯文字與上傳圖片。
        </p>
      </div>

      <div className="filter-section">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          全部
        </button>
        {Object.keys(typeLabels).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            className={`filter-btn ${filter === type ? 'active' : ''}`}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      {!showForm && (
        <div className="action-section">
          <span className="action-label">新增項目：</span>
          {Object.keys(typeLabels).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => openCreate(type)}
              className="create-btn"
            >
              + {typeLabels[type]}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <div className="editor-container">
          <h2 className="editor-title">
            {editing ? '編輯比賽消息' : '新增比賽消息'}
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">分類</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                className="form-select"
              >
                {Object.entries(typeLabels).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">標題</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="form-input"
                placeholder="輸入標題..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">內文 (可換行)</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="form-textarea"
                placeholder="輸入內文..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">圖片網址</label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                className="form-input"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={submit} className="btn-submit">
              {editing ? '儲存變更' : '確定新增'}
            </button>
            <button type="button" onClick={closeForm} className="btn-cancel">
              取消
            </button>
          </div>
        </div>
      )}

      <div className="list-container">
        {filtered.length === 0 && (
          <div className="empty-state">
            {filter === 'all' ? '尚無比賽消息。' : `尚無「${typeLabels[filter]}」消息。`}
          </div>
        )}
        {filtered.map((item) => (
          <div key={item.id} className="competition-card">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt=""
                className="card-image"
              />
            )}
            <div className="card-content">
              <span className="badge">
                {typeLabels[item.type]}
              </span>
              <h3 className="title">{item.title}</h3>
              <p className="desc">
                {item.content || '（無內文）'}
              </p>
              <p className="meta">
                更新：{new Date(item.updatedAt).toLocaleString('zh-TW')}
              </p>
            </div>
            <div className="card-actions">
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="btn-action edit"
              >
                編輯
              </button>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="btn-action delete"
              >
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
