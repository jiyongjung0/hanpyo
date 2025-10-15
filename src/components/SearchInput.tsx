import { useEffect, useRef } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleClear()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.select()
    }
  }

  return (
    <div className="search-section">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          placeholder="원어 표기를 입력하세요 (예: Josie)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        {value && (
          <button
            onClick={handleClear}
            className="clear-button"
            aria-label="입력 내용 지우기"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
