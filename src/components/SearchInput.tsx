import { useEffect, useRef } from 'react'
import styles from './SearchInput.module.css'
import { MESSAGES } from '../constants/messages'
import { useGlobalKeyboardFocus } from '../hooks/useGlobalKeyboardFocus'

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
  useGlobalKeyboardFocus(inputRef)

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
    <div className={styles.searchSection}>
      <label htmlFor="search-input" className="visually-hidden">
        {MESSAGES.INPUT_LABEL}
      </label>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          placeholder={MESSAGES.INPUT_PLACEHOLDER}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
          aria-label={MESSAGES.INPUT_LABEL}
        />
        {value && (
          <button
            onClick={handleClear}
            className={styles.clearButton}
            aria-label={MESSAGES.CLEAR_BUTTON_LABEL}
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
