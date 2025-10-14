import './App.css'
import { useForeignWordData } from './hooks/useForeignWordData'
import { useSearch } from './hooks/useSearch'
import { SearchInput } from './components/SearchInput'
import { ResultsTable } from './components/ResultsTable'
import { DATA_UPDATE_DATE } from './dataUpdateDate'

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

      {searchQuery && <ResultsTable data={filteredData} query={searchQuery} />}

      <p className="data-source">
        데이터 출처:{' '}
        <a
          href="https://korean.go.kr/kornorms/example/exampleList.do?regltn_code=0003"
          target="_blank"
          rel="noopener noreferrer"
        >
          국립국어원 외래어 표기 용례
        </a>
        {' '}({DATA_UPDATE_DATE} 다운로드)
      </p>
    </div>
  )
}

export default App
