import { useState, useEffect, useRef } from 'react'
import '../../../styles/pages/admin/calendar/CalendarPage.scss'
import { Pagination } from '../../../components/admin/Pagination'

function toMonthKey(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function CalendarPage() {
  const [months, setMonths] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [uploadFile, setUploadFile] = useState(null)
  const [previewMonth, setPreviewMonth] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const fileInputRef = useRef(null)

  const fetchCalendars = async (page = currentPage) => {
    try {
      const res = await fetch(`http://localhost:3000/api/calendar?page=${page}&limit=20`)
      if (res.ok) {
        const { data, pagination } = await res.json()
        setMonths(data)
        setTotalPages(pagination.totalPages)
      }
    } catch (err) {
      console.error('Failed to fetch calendars:', err)
    }
  }

  useEffect(() => {
    fetchCalendars(currentPage)
  }, [currentPage])

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  const currentMonthData = months.find(
    (m) => m.year === selectedYear && m.month === selectedMonth
  )

  const handleSave = async () => {
    if (!uploadFile) return
    setIsLoading(true)

    const formData = new FormData()
    formData.append('year', selectedYear)
    formData.append('month', selectedMonth)
    formData.append('image', uploadFile)

    try {
      const res = await fetch('http://localhost:3000/api/calendar/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        alert('上傳成功！')
        setUploadFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = '' // 清除選擇的檔案
        }
        setShowForm(false) // 返回列表
        fetchCalendars()
      } else {
        const errData = await res.json()
        alert('上傳失敗: ' + errData.error)
      }
    } catch (err) {
      console.error(err)
      alert('上傳失敗！')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (year, month) => {
    if (!confirm('確定要刪除？')) return
    
    try {
      const res = await fetch(`http://localhost:3000/api/calendar/${year}/${month}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        if (previewMonth?.year === year && previewMonth?.month === month) {
          setPreviewMonth(null)
        }
        fetchCalendars()
      } else {
        alert('刪除失敗！')
      }
    } catch (err) {
      console.error(err)
      alert('刪除失敗！')
    }
  }

  const sortedMonths = [...months].sort(
    (a, b) => a.year - b.year || a.month - b.month
  )

  return (
    <div className="calendar-page">
      <div className="page-header">
        <div>
          <h1 className="title">行事曆管理</h1>
          <p className="subtitle">
            以月份分類上傳行事曆圖片，可提前上傳未來月份或瀏覽過往月份。
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-create">
            + 新增行事曆
          </button>
        )}
      </div>

      {showForm ? (
        <section className="section-card">
          <h2 className="section-title">上傳行事曆</h2>
          <div className="upload-form">
            <div className="form-group">
              <label className="form-label">年份</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="form-select"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">月份</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="form-select"
              >
                {monthOptions.map((m) => (
                  <option key={m} value={m}>{m} 月</option>
                ))}
              </select>
            </div>
            <div className="form-group flex-1">
              <label className="form-label">上傳圖片檔案</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setUploadFile(file)
                  }
                }}
                className="file-input"
              />
              <p className="hint-text">
                直接選擇圖片，將會上傳至系統資料庫儲存。
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleSave}
                className="btn-submit"
                disabled={isLoading || !uploadFile}
                style={{ opacity: (isLoading || !uploadFile) ? 0.5 : 1 }}
              >
                {isLoading ? '處理中...' : (currentMonthData ? '更新檔案' : '確認上傳')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-submit"
                style={{ backgroundColor: '#f3f4f6', color: '#4b5563' }}
              >
                取消
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="section-card">
          <h2 className="section-title">已上傳月份一覽</h2>
          <div className="list-container">
            {sortedMonths.length === 0 ? (
              <div className="empty-state">尚無行事曆資料，請先上傳。</div>
            ) : (
              sortedMonths.map((m) => (
                <div key={toMonthKey(m.year, m.month)} className="list-item-card">
                  <div className="item-content">
                    <div className="item-badge">
                      {m.year} 年 {m.month} 月
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      type="button"
                      onClick={() => setPreviewMonth(m)}
                      className="action-btn preview"
                    >
                      預覽
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.year, m.month)}
                      className="action-btn delete"
                    >
                      刪除
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
        </section>
      )}

      {previewMonth && (
        <div className="modal-overlay" onClick={() => setPreviewMonth(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {previewMonth.year} 年 {previewMonth.month} 月 行事曆
              </h3>
              <button
                type="button"
                onClick={() => setPreviewMonth(null)}
                className="btn-close"
              >
                關閉
              </button>
            </div>
            <img
              src={previewMonth.imageUrl}
              alt={`${previewMonth.year}年${previewMonth.month}月行事曆`}
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  )
}
