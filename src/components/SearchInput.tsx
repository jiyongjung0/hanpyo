interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  resultCount?: number
}

export const SearchInput = ({ value, onChange, resultCount }: SearchInputProps) => {
  return (
    <div className="search-section">
      <input
        type="text"
        placeholder="원어 표기를 입력하세요 (예: Josie)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
      {value && resultCount !== undefined && (
        <div className="result-count">
          검색 결과: {resultCount}개
        </div>
      )}
    </div>
  )
}
