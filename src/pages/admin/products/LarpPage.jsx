import { useState, useEffect, useMemo } from 'react'
import '../../../styles/pages/admin/products/LarpPage.scss'
import { TagSelect } from '../../../components/admin/TagSelect'

export function LarpPage() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const defaultForm = {
    name: '',
    role: '',
    publisher: '',
    remark: '',
    tags: [],
  }

  const [form, setForm] = useState(defaultForm)

  const fetchLarp = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/lapr')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (err) {
      console.error('Failed to fetch larp:', err)
    }
  }

  useEffect(() => {
    fetchLarp()
  }, [])

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return items.filter((item) =>
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.publisher?.toLowerCase().includes(keyword) ||
      item.remark?.toLowerCase().includes(keyword)
    )
  }, [items, search])

  const openCreate = () => {
    setForm(defaultForm)
    setEditing(null)
    setIsCreating(true)
  }

  const openEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      role: item.role || '',
      publisher: item.publisher || '',
      remark: item.remark || '',
      tags: item.tags || [],
    })
    setEditing(item)
    setIsCreating(true)
  }

  const submit = async () => {
    if (!form.name.trim()) return alert('請輸入劇本名稱')
    setIsLoading(true)

    const payload = {
      ...form,
      tags: form.tags
    }

    try {
      let res;
      if (editing) {
        res = await fetch(`http://localhost:3000/api/lapr/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('http://localhost:3000/api/lapr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (res.ok) {
        alert(editing ? '更新成功！' : '建立成功！')
        setIsCreating(false)
        setEditing(null)
        setForm(defaultForm)
        fetchLarp()
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
      const res = await fetch(`http://localhost:3000/api/lapr/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchLarp()
      } else {
        alert('刪除失敗！')
      }
    } catch (err) {
      console.error('Delete failed:', err)
      alert('刪除失敗！')
    }
  }

  const showForm = isCreating || editing

  return (
    <div className="larp-page">
      <div className="page-header">
        <div>
          <h1 className="title">劇本殺款式管理</h1>
          <p className="subtitle">連接資料庫 `lapr` 表單，管理劇本殺遊戲相關資訊。</p>
        </div>
        {!showForm && (
          <button onClick={openCreate} className="btn-create">
            + 新增劇本
          </button>
        )}
      </div>

      {showForm && (
        <div className="editor-panel">
          <h2 className="editor-header">
            {editing ? '📝 編輯劇本資訊' : '📖 新增劇本項目'}
          </h2>

          <div className="editor-layout">
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">劇本名稱</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="form-input"
                  placeholder="例如：死者在幻夜中醒來"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">👥 參與人數/性別</label>
                  <input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="form-input"
                    placeholder="例如：6人 (3男3女)"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🏢 出版商</label>
                  <input
                    value={form.publisher}
                    onChange={(e) => setForm((f) => ({ ...f, publisher: e.target.value }))}
                    className="form-input"
                    placeholder="例如：測序劇本工作室"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">🏷️ 標籤 (最多 2 個)</label>
                <TagSelect 
                  selectedTags={form.tags} 
                  onTagsChange={(newTags) => setForm(f => ({ ...f, tags: newTags }))} 
                  max={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">📝 備註 / 簡介</label>
                <textarea
                  value={form.remark}
                  onChange={(e) => setForm((f) => ({ ...f, remark: e.target.value }))}
                  className="form-textarea"
                  placeholder="描述劇本風格、難度或是特色..."
                />
              </div>

              <div className="form-actions">
                <button onClick={submit} className="btn-submit" disabled={isLoading}>{isLoading ? '儲存中...' : '儲存劇本資訊'}</button>
                <button onClick={() => { setIsCreating(false); setEditing(null); }} className="btn-cancel">取消</button>
              </div>
            </div>

            <div className="preview-section">
              <div className="preview-wrapper">
                <span className="preview-label">Live Preview</span>
                <div className="preview-card">
                  <div className="preview-content">
                    <h4 className="preview-title">{form.name || '劇本名稱'}</h4>
                    <div className="preview-meta">
                      <span className="meta-item">👥 {form.role || '人數未知'}</span>
                      <span className="meta-item">🏢 {form.publisher || '出版商未知'}</span>
                    </div>
                    {form.tags && form.tags.length > 0 && (
                      <div className="preview-tags">
                        {form.tags.map((t, i) => (
                          <span key={i} className="tag-pill">{t}</span>
                        ))}
                      </div>
                    )}
                    <p className="preview-remark">
                      {form.remark || '這裡將會顯示這款劇本的風格說明與玩法簡介...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <>
          <div className="search-container">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              placeholder="搜尋名稱、出版商或備註…"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="list-container">
            {filteredItems.length === 0 ? (
              <div className="empty-state">
                目前沒有建立任何劇本殺
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="list-item-card">
                  <div className="item-content">
                    <h3 className="item-title">{item.name}</h3>
                    <div className="item-meta">
                      <span className="meta-item">👥 {item.role}</span>
                      <span className="meta-item">🏢 {item.publisher}</span>
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="item-tags">
                        {item.tags.map((t, i) => <span key={i} className="tag-label">{t}</span>)}
                      </div>
                    )}
                    <p className="item-desc">{item.remark || '暫無說明'}</p>
                  </div>

                  <div className="item-actions">
                    <button onClick={() => openEdit(item)} className="action-btn edit" title="編輯">✏️</button>
                    <button onClick={() => handleDelete(item.id)} className="action-btn delete" title="刪除">🗑️</button>
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
