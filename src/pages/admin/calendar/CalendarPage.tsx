import { useState, useEffect } from 'react'
import './CalendarPage.scss'

const STORAGE_KEY = 'esn_calendar'

export interface CalendarMonth {
  year: number
  month: number
  imageUrl: string
  createdAt: string
}

function getMonths(): CalendarMonth[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveMonths(data: CalendarMonth[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function toMonthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function CalendarPage() {
  const [months, setMonths] = useState<CalendarMonth[]>(getMonths)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [uploadUrl, setUploadUrl] = useState('')
  const [previewMonth, setPreviewMonth] = useState<CalendarMonth | null>(null)

  useEffect(() => {
    saveMonths(months)
  }, [months])

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  const currentMonthData = months.find(
    (m) => m.year === selectedYear && m.month === selectedMonth
  )

  const handleSave = () => {
    if (!uploadUrl.trim()) return
    const key = toMonthKey(selectedYear, selectedMonth)
    const existing = months.findIndex(
      (m) => toMonthKey(m.year, m.month) === key
    )
    const newItem: CalendarMonth = {
      year: selectedYear,
      month: selectedMonth,
      imageUrl: uploadUrl.trim(),
      createdAt: new Date().toISOString(),
    }
    if (existing >= 0) {
      const next = [...months]
      next[existing] = newItem
      setMonths(next)
    } else {
      setMonths([...months, newItem])
    }
    setUploadUrl('')
  }

  const handleDelete = (year: number, month: number) => {
    if (!confirm('確定要刪除？')) return
    setMonths(months.filter((m) => !(m.year === year && m.month === month)))
    if (previewMonth?.year === year && previewMonth?.month === month) {
      setPreviewMonth(null)
    }
  }

  const sortedMonths = [...months].sort(
    (a, b) => a.year - b.year || a.month - b.month
  )

  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1 className="title">行事曆管理</h1>
        <p className="subtitle">
          以月份分類上傳行事曆圖片，可提前上傳未來月份或瀏覽過往月份。
        </p>
      </div>

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
          <div className="form-group" style={{ flex: 1, minWidth: '220px' }}>
            <label className="form-label">上傳圖片檔案</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  const result = reader.result
                  if (typeof result === 'string') {
                    setUploadUrl(result)
                  }
                }
                reader.readAsDataURL(file)
              }}
              className="file-input"
            />
            <p className="hint-text">
              直接選擇圖片，系統會自動轉換並儲存。
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="btn-submit"
          >
            {currentMonthData ? '更新檔案' : '確認上傳'}
          </button>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">已上傳月份一覽</h2>
        <div className="month-grid">
          {sortedMonths.length === 0 ? (
            <div className="empty-state">尚無行事曆資料，請先上傳。</div>
          ) : (
            sortedMonths.map((m) => (
              <div key={toMonthKey(m.year, m.month)} className="month-card">
                <button
                  type="button"
                  onClick={() => setPreviewMonth(m)}
                  className="month-label"
                >
                  {m.year} 年 {m.month} 月
                </button>
                <div className="month-actions">
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
      </section>

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
