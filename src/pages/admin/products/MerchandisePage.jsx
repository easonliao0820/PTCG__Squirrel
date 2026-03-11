import { useState, useEffect, useMemo } from 'react'
import '../../../styles/pages/admin/products/MerchandisePage.scss'

const STORAGE_KEY = 'esn_merchandise_v2'



function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function MerchandisePage() {
  const [items, setItems] = useState(load)
  const [editing, setEditing] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
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
    setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' })
    setEditing(null)
    setIsCreating(true)
  }

  const openEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      stock: String(item.stock),
      imageUrl: item.imageUrl
    })
    setEditing(item)
    setIsCreating(false)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === 'string' && setForm(f => ({ ...f, imageUrl: reader.result }))
    reader.readAsDataURL(file)
  }

  const submit = () => {
    if (!form.name.trim()) return alert('請輸入商品名稱')
    const price = Number(form.price) || 0
    const stock = Number(form.stock) || 0
    const now = new Date().toISOString()

    if (editing) {
      setItems(items.map(i => i.id === editing.id ? {
        ...i,
        name: form.name,
        description: form.description,
        price,
        stock,
        imageUrl: form.imageUrl,
        updatedAt: now
      } : i))
    } else {
      setItems([{
        id: crypto.randomUUID(),
        name: form.name,
        description: form.description,
        price,
        stock,
        imageUrl: form.imageUrl,
        createdAt: now,
        updatedAt: now
      }, ...items])
    }
    setIsCreating(false); setEditing(null)
  }

  const showForm = isCreating || editing

  return (
    <div className="merchandise-page">
      <div className="page-header">
        <div>
          <h1 className="title">周邊商品管理</h1>
          <p className="subtitle">管理店內販售商品、調整描述、價格與即時庫存。</p>
        </div>
        {!showForm && (
          <button onClick={openCreate} className="btn-create">
            + 新增商品
          </button>
        )}
      </div>

      {showForm ? (
        <div className="editor-grid">
          <div className="form-panel">
            <div className="form-group title-group">
              <label className="form-label">商品名稱</label>
              <input
                type="text"
                className="form-input"
                placeholder="例如：限定版戰鬥桌墊"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">商品說明</label>
              <textarea
                className="form-textarea"
                placeholder="請輸入商品的詳細介紹..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">售價 (NT$)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">目前庫存</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.stock}
                  onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">商品圖片</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="file-input"
              />
            </div>

            <div className="form-actions">
              <button onClick={submit} className="btn-save">儲存變更</button>
              <button onClick={() => { setIsCreating(false); setEditing(null) }} className="btn-cancel">取消</button>
            </div>
          </div>

          <div className="preview-panel">
            <div className="preview-wrapper">
              <span className="preview-label">前台卡片預覽</span>
              <div className="preview-card">
                <div className="preview-img-container">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="" />
                  ) : (
                    <div className="no-img">尚未上傳圖片</div>
                  )}
                </div>
                <div className="preview-content">
                  <h3 className="preview-title">{form.name || '商品名稱'}</h3>
                  <p className="preview-desc">{form.description || '尚未輸入商品說明...'}</p>
                  <div className="preview-footer">
                    <span className="price">NT$ {Number(form.price).toLocaleString() || 0}</span>
                    <span className={`stock-badge ${Number(form.stock) > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      庫存 {form.stock || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="controls-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="搜尋商品名稱或說明..."
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="product-grid">
            {filteredItems.length === 0 ? (
              <div className="empty-state">尚未建立商品。</div>
            ) : (
              filteredItems.map(item => (
                <div key={item.id} className="product-card">
                  <div className="card-image-wrapper">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="no-image">無圖片</div>
                    )}
                    <div className="stock-status">
                      <span className={item.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                        {item.stock > 0 ? `STOCK: ${item.stock}` : 'SOLD OUT'}
                      </span>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">{item.name}</h3>
                    <p className="card-desc">{item.description || '暫無商品說明'}</p>
                    <p className="card-price">NT$ {item.price.toLocaleString()}</p>

                    <div className="card-actions">
                      <button onClick={() => openEdit(item)} className="btn-edit">
                        編輯詳情
                      </button>
                      <button onClick={() => confirm('確定要刪除？') && setItems(items.filter(i => i.id !== item.id))} className="btn-delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}