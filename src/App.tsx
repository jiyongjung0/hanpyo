import './App.css'
import { useForeignWordData } from './hooks/useForeignWordData'
import { useSearch } from './hooks/useSearch'
import { SearchInput } from './components/SearchInput'
import { ResultsTable } from './components/ResultsTable'

function App() {
  const { data, loading, error } = useForeignWordData()
  const { searchQuery, setSearchQuery, filteredData } = useSearch(data)

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">데이터 로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>외래어 표기 검색</h1>
        <p className="subtitle">원어 표기를 검색하세요</p>
      </header>

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        resultCount={filteredData.length}
      />

      {searchQuery && <ResultsTable data={filteredData} />}

      {searchQuery && searchQuery.trim().length === 1 && (
        <div className="no-results">
          두 글자 이상 입력해주세요.
        </div>
      )}

      {searchQuery && searchQuery.trim().length >= 2 && filteredData.length === 0 && (
        <div className="no-results">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  )
}

export default App
