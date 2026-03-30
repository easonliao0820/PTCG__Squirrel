import { useState, useEffect, useRef } from 'react'
import '../../../styles/pages/admin/products/MerchandisePage.scss'
import { Pagination } from '../../../components/admin/Pagination'

export function MerchandisePage() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fileInputRef = useRef(null)

  const defaultForm = {
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    uploadFile: null,
  }

  const [form, setForm] = useState(defaultForm)

  const fetchCommodities = async (page = currentPage, searchTerm = search) => {
    try {
      const res = await fetch(`/api/commodities?page=${page}&limit=20&search=${searchTerm}`)
      if (res.ok) {
        const { data, pagination } = await res.json()
        setItems(data)
        setTotalPages(pagination.totalPages)
      }
    } catch (err) {
      console.error('Failed to fetch commodities:', err)
    }
  }

  useEffect(() => {
    fetchCommodities(currentPage, search)
  }, [currentPage])

  // 搜尋時回到第一頁
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchCommodities(1, search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  // Server-side filtering now
  const filteredItems = items

  const openCreate = () => {
    setForm(defaultForm)
    setEditing(null)
    setIsCreating(true)
  }

  const openEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      description: item.content || '',
      price: String(item.price),
      stock: String(item.stock),
      imageUrl: item.imageUrl || '',
      uploadFile: null
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
    if (!form.name.trim()) return alert('請輸入商品名稱')
    setIsLoading(true)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('content', form.description)
    formData.append('price', form.price)
    formData.append('stock', form.stock)
    if (form.uploadFile) formData.append('image', form.uploadFile)

    try {
      let res;
      if (editing) {
        res = await fetch(`/api/commodities/${editing.id}`, {
          method: 'PUT',
          body: formData
        })
      } else {
        res = await fetch('/api/commodities', {
          method: 'POST',
          body: formData
        })
      }

      if (res.ok) {
        alert(editing ? '更新成功！' : '建立成功！')
        setIsCreating(false)
        setEditing(null)
        setForm(defaultForm)
        fetchCommodities()
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
      const res = await fetch(`/api/commodities/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCommodities()
      } else {
        alert('刪除失敗！')
      }
    } catch (err) {
      console.error('Delete failed:', err)
      alert('刪除失敗！')
    }
  }

  const showForm = isCreating

  return (
    <div className="merchandise-page">
      <div className="page-header">
        <div>
          <h1 className="title">周邊商品管理</h1>
          <p className="subtitle">連接資料庫 `commodity`，管理店內商品名稱、售價(money)與庫存。</p>
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
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="file-input"
              />
            </div>

            <div className="form-actions">
              <button onClick={submit} className="btn-save" disabled={isLoading}>{isLoading ? '儲存中...' : '儲存變更'}</button>
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
                placeholder="搜尋商品名稱..."
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="list-container">
            {filteredItems.length === 0 ? (
              <div className="empty-state">尚未建立商品。</div>
            ) : (
              filteredItems.map(item => (
                <div key={item.id} className="list-item-card">
                  <div className="item-content">
                    <div className="item-meta">
                      <span className={`stock-badge ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {item.stock > 0 ? `庫存: ${item.stock}` : 'SOLD OUT'}
                      </span>
                    </div>

                    <h3 className="item-title">{item.name}</h3>
                    <p className="item-price">NT$ {item.price.toLocaleString()}</p>
                    <p className="item-desc">{item.content || '暫無商品說明'}</p>
                  </div>

                  <div className="item-thumbnail">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="no-image">無圖片</div>
                    )}
                  </div>

                  <div className="item-actions">
                    <button onClick={() => openEdit(item)} className="action-btn edit" title="編輯">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="action-btn delete" title="刪除">
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}
    </div>
  )
}