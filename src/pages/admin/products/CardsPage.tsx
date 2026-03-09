import { useState, useEffect } from 'react'
import './CardsPage.scss'

const STORAGE_KEY = 'esn_cards'

export type CardCategory = 'ptcg_buy' | 'ptcg_sell' | 'ultraman_pack'

export interface CardItem {
  id: string
  category: CardCategory
  name: string
  description: string
  price?: number
  imageUrl: string
  createdAt: string
  updatedAt: string
}

const categoryLabels: Record<CardCategory, string> = {
  ptcg_buy: 'PTCG 收卡',
  ptcg_sell: 'PTCG 出售單張卡牌',
  ultraman_pack: '超人力霸王 卡包',
}

function load(): CardItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(data: CardItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function CardsPage() {
  const [items, setItems] = useState<CardItem[]>(load)
  const [filter, setFilter] = useState<CardCategory | 'all'>('all')
  const [editing, setEditing] = useState<CardItem | null>(null)
  const [form, setForm] = useState<{
    category: CardCategory
    name: string
    description: string
    price: string
    imageUrl: string
  }>({
    category: 'ptcg_buy',
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    save(items)
  }, [items])

  const filtered =
    filter === 'all' ? items : items.filter((i) => i.category === filter)

  const openCreate = (category?: CardCategory) => {
    setForm({
      category: category ?? 'ptcg_buy',
      name: '',
      description: '',
      price: '',
      imageUrl: '',
    })
    setEditing(null)
    setIsCreating(true)
  }

  const openEdit = (item: CardItem) => {
    setForm({
      category: item.category,
      name: item.name,
      description: item.description,
      price: item.price != null ? String(item.price) : '',
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
    if (!form.name.trim()) return
    const now = new Date().toISOString()
    const price = form.price.trim() ? Number(form.price) : undefined
    if (editing) {
      setItems(
        items.map((i) =>
          i.id === editing.id
            ? {
                ...i,
                category: form.category,
                name: form.name,
                description: form.description,
                price,
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
          category: form.category,
          name: form.name,
          description: form.description,
          price,
          imageUrl: form.imageUrl.trim(),
          createdAt: now,
          updatedAt: now,
        },
        ...items,
      ])
    }
    closeForm()
  }

  const remove = (id: string) => {
    if (confirm('確定要刪除？')) {
      setItems(items.filter((i) => i.id !== id))
      closeForm()
    }
  }

  const showForm = isCreating || editing

  return (
    <div className="cards-page">
      <div className="page-header">
        <h1 className="title">卡牌管理</h1>
        <p className="subtitle">
          PTCG：向使用者收卡、向使用者出售單張卡牌。超人力霸王：販賣卡包。
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
        {(Object.keys(categoryLabels) as CardCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {!showForm && (
        <div className="action-section">
          <span className="action-label">新增：</span>
          {(Object.keys(categoryLabels) as CardCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => openCreate(cat)}
              className="create-btn"
            >
              + {categoryLabels[cat]}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <div className="editor-container">
          <h2 className="editor-title">
            {editing ? '編輯項目' : '新增項目'}
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">分類</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as CardCategory }))
                }
                className="form-select"
              >
                {(Object.entries(categoryLabels) as [CardCategory, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">名稱</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="form-input"
                placeholder="卡牌／卡包名稱"
              />
            </div>
            <div className="form-group">
              <label className="form-label">說明（選填）</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="form-textarea"
                placeholder="說明內容"
              />
            </div>
            <div className="form-group">
              <label className="form-label">價格（選填）</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="form-input"
                placeholder="0"
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
              {editing ? '儲存變更' : '新增'}
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
            {filter === 'all' ? '尚無卡牌／卡包資料。' : `尚無「${categoryLabels[filter]}」資料。`}
          </div>
        )}
        {filtered.map((item) => (
          <div key={item.id} className="card-item">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt=""
                className="card-image"
              />
            )}
            <div className="card-content">
              <span className="badge">
                {categoryLabels[item.category]}
              </span>
              <h3 className="title">{item.name}</h3>
              {item.description && (
                <p className="desc">{item.description}</p>
              )}
              {item.price != null && (
                <p className="price">NT$ {item.price}</p>
              )}
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
