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

  // 전역 키보드 이벤트: 입력창에 포커스가 없어도 일반 문자 입력 시 자동 포커스
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 이미 입력창에 포커스가 있으면 무시
      if (document.activeElement === inputRef.current) {
        return
      }

      // 스페이스바, 혹은 modifier 키와 함께 눌린 경우 무시 (Ctrl+C, Cmd+V 등)
      if (e.ctrlKey || e.altKey || e.metaKey || e.key === ' ') {
        return
      }

      // 입력 가능한 단일 문자인 경우에만 포커스 이동
      if (e.key.length === 1) {
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
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
