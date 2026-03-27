import { useState, useEffect, useRef } from 'react'
import '../../styles/components/TagSelect.scss'

export function TagSelect({ selectedTags = [], onTagsChange, max = 2, tagClass }) {
  const [allTags, setAllTags] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const url = tagClass !== undefined 
          ? `http://localhost:3000/api/tags?class=${tagClass}`
          : 'http://localhost:3000/api/tags';
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setAllTags(data)
        }
      } catch (err) {
        console.error('Failed to fetch tags:', err)
      }
    }
    fetchTags()
  }, [tagClass])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      if (selectedTags.length < max) {
        onTagsChange([...selectedTags, tag])
      }
    }
  }

  const filteredTags = allTags.filter(t => 
    t.toLowerCase().includes(search.toLowerCase()) && !selectedTags.includes(t)
  )

  return (
    <div className="tag-select-container" ref={containerRef}>
      <div className="tag-select-input-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <div className="selected-tags">
          {selectedTags.map(tag => (
            <span key={tag} className="tag-pill">
              {tag}
              <button 
                type="button" 
                className="remove-tag" 
                onClick={(e) => {
                  e.stopPropagation()
                  toggleTag(tag)
                }}
              >
                &times;
              </button>
            </span>
          ))}
          {selectedTags.length < max && (
            <input 
              type="text"
              className="tag-search-input"
              placeholder={selectedTags.length === 0 ? "選擇標籤..." : ""}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setIsOpen(true)
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
        <div className="tag-select-arrow">
          {isOpen ? '▲' : '▼'}
        </div>
      </div>

      {isOpen && (
        <div className="tag-dropdown">
          {filteredTags.length > 0 ? (
            filteredTags.map(tag => (
              <div 
                key={tag} 
                className={`tag-option ${selectedTags.length >= max ? 'disabled' : ''}`}
                onClick={() => {
                  if (selectedTags.length < max) {
                    toggleTag(tag)
                    setSearch('')
                  }
                }}
              >
                {tag}
              </div>
            ))
          ) : (
            <div className="no-tags">沒有更多可選標籤</div>
          )}
        </div>
      )}
      <div className="tag-hint">最多可選擇 {max} 個標籤</div>
    </div>
  )
}
