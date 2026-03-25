import { useEffect, useState, useRef } from 'react'
import '../../../styles/pages/admin/activity/ActivityNewsPage.scss'
import { Pagination } from '../../../components/admin/Pagination'

const classConfig = {
  1: { label: '一般活動', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  2: { label: 'PTCG 比賽', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  3: { label: '超人力霸王', color: 'bg-red-100 text-red-800 border-red-200' },
  4: { label: '活動成果', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
}

const styleOptions = [
  { value: 1, label: '經典圖左', desc: '圖左文右', className: 'layout-left' },
  { value: 2, label: '焦點圖右', desc: '文左圖右', className: 'layout-right' },
]

export function ActivityNewsPage() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all') // 'all' or class_id number
  const [editing, setEditing] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const defaultForm = {
    title: '',
    content: '',
    images: [null, null], // [File, File]
    previews: ['', ''],   // [string, string]
    classId: 1,
    styleId: 1,
    startAt: '',
    endAt: '',
    url: '',
  }

  const [form, setForm] = useState(defaultForm)

  const fetchActivities = async (page = currentPage, searchTerm = search, classFilter = filter) => {
    try {
      const res = await fetch(`http://localhost:3000/api/activities?page=${page}&limit=20&search=${searchTerm}&classId=${classFilter}`)
      if (res.ok) {
        const { data, pagination } = await res.json()
        setItems(data)
        setTotalPages(pagination.totalPages)
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err)
    }
  }

  useEffect(() => {
    fetchActivities(currentPage, search, filter)
  }, [currentPage, filter])

  // 搜尋時回到第一頁
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchActivities(1, search, filter)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  // Server-side filtering now
  const filteredItems = items

  const handleFileUpload = (e, index) => {
    const file = e.target.files?.[0]; 
    if (!file) return
    const reader = new FileReader();
    reader.onload = () => {
      setForm(f => {
        const newImages = [...f.images]
        const newPreviews = [...f.previews]
        newImages[index] = file
        newPreviews[index] = reader.result
        return { ...f, images: newImages, previews: newPreviews }
      })
    }
    reader.readAsDataURL(file)
  }

  const submit = async () => {
    if (!form.title.trim()) return alert('請輸入標題')
    setIsLoading(true)

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('content', form.content)
    formData.append('classId', form.classId)
    formData.append('styleId', form.styleId)
    if (form.startAt) formData.append('startAt', form.startAt)
    if (form.endAt) formData.append('endAt', form.endAt)
    if (form.url) formData.append('url', form.url)
    // Append all selected files
    form.images.forEach((file, idx) => {
      if (file && (form.styleId === 1 || idx === 0)) {
        formData.append('images', file)
      }
    })

    try {
      let res;
      if (editing) {
        res = await fetch(`http://localhost:3000/api/activities/${editing.id}`, {
          method: 'PUT',
          body: formData
        })
      } else {
        res = await fetch('http://localhost:3000/api/activities', {
          method: 'POST',
          body: formData
        })
      }

      if (res.ok) {
        alert(editing ? '更新成功！' : '建立成功！')
        setIsCreating(false)
        setEditing(null)
        setForm(defaultForm)
        fetchActivities()
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
      const res = await fetch(`http://localhost:3000/api/activities/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchActivities()
      } else {
        alert('刪除失敗！')
      }
    } catch (err) {
      console.error('Delete failed:', err)
      alert('刪除失敗！')
    }
  }

  // --- 渲染組件：編輯時的版面預覽 ---
  const LayoutPreview = ({ item }) => {
    const config = classConfig[item.classId] || classConfig[1]
    const styleOpt = styleOptions.find(o => o.value === item.styleId) || styleOptions[0]
    const layoutClass = styleOpt.className
    const period = item.startAt || item.endAt ? `${item.startAt || ''} ~ ${item.endAt || ''}` : null
    const validPreviews = (item.previews || []).filter((p, i) => p && (item.styleId === 1 || i === 0))

    return (
      <div className={`preview-card ${layoutClass}`}>
        {validPreviews.length > 0 && (
          <div className={`preview-img-wrapper ${layoutClass === 'layout-top' ? 'top' : 'side'} ${validPreviews.length > 1 ? 'multi' : ''}`}>
            {validPreviews.map((url, idx) => (
              <img key={idx} src={url} alt="" className={validPreviews.length > 1 ? 'split' : ''} />
            ))}
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
    const config = classConfig[item.classId] || classConfig[1]
    const period = item.startAt || item.endAt ? `${item.startAt || ''} ~ ${item.endAt || ''}` : null

    return (
      <div className="list-item-card">
        <div className="item-content">
          <div className="item-meta">
            <span className={`badge ${config.color.split(' ').join(' ')}`}>
              {config.label}
            </span>
            <span className="date-updated">發佈中</span>
          </div>
          <h3 className="item-title">{item.title}</h3>
          {period && <p className="item-period">📅 {period}</p>}
          <p className="item-desc">{item.content}</p>
        </div>

        {item.imageUrls && item.imageUrls.length > 0 && (
          <div className="item-thumbnail">
            <img src={item.imageUrls[0]} alt="" />
            {item.imageUrls.length > 1 && <span className="img-count">+{item.imageUrls.length - 1}</span>}
          </div>
        )}

        <div className="item-actions">
          <button
            onClick={() => {
              setEditing(item)
              setIsCreating(true)
              setForm({
                id: item.id,
                title: item.title || '',
                content: item.content || '',
                images: [null, null],
                previews: item.imageUrls || ['', ''],
                classId: item.classId || 1,
                styleId: item.styleId || 1,
                startAt: item.startAt || '',
                endAt: item.endAt || '',
                url: item.url || '',
              })
            }}
            className="action-btn edit"
            title="編輯"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDelete(item.id)}
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
          <p className="page-subtitle">統一管理店內公告與比賽紀錄，連接資料庫 `activity` 表格。</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setIsCreating(true); setEditing(null); setForm(defaultForm) }}
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
                <label className="form-label">活動分類 (Class)</label>
                <select className="form-select" value={form.classId} onChange={e => setForm(f => ({ ...f, classId: Number(e.target.value) }))}>
                  {Object.entries(classConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">版面樣式 (Style)</label>
                <div className="layout-options">
                  {styleOptions.map(opt => (
                    <button key={opt.value} onClick={() => setForm(f => ({ ...f, styleId: opt.value }))} className={`layout-btn ${form.styleId === opt.value ? 'active' : ''}`}>{opt.label}</button>
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
              <label className="form-label">活動配圖 (最多 {form.styleId === 1 ? 2 : 1} 張)</label>
              <div className="image-upload-grid">
                {[...Array(form.styleId === 1 ? 2 : 1)].map((_, idx) => (
                  <div key={idx} className="file-input-group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, idx)} 
                      className="file-input" 
                    />
                    {form.previews[idx] && (
                      <div className="mini-preview">
                        <img src={form.previews[idx]} alt="" />
                        <button type="button" className="btn-remove" onClick={() => {
                          setForm(f => {
                            const newImages = [...f.images]
                            const newPreviews = [...f.previews]
                            newImages[idx] = null
                            newPreviews[idx] = ''
                            return { ...f, images: newImages, previews: newPreviews }
                          })
                        }}>✕</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">活動連結 (選填)</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="form-input"
                placeholder="https://example.com"
              />
            </div>

            <div className="form-actions">
              <button onClick={submit} className="btn-save" disabled={isLoading}>{isLoading ? '儲存中...' : '儲存變更'}</button>
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
              {Object.entries(classConfig).map(([k, v]) => (
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