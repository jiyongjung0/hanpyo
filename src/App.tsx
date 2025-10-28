import './App.css'
import { useForeignWordData } from './hooks/useForeignWordData'
import { useSearch } from './hooks/useSearch'
import { SearchInput } from './components/SearchInput'
import { ResultsTable } from './components/ResultsTable'
import { Footer } from './components/Footer'
import { MESSAGES } from './constants/messages'

function App() {
  const { data, loading, error } = useForeignWordData()
  const { searchQuery, setSearchQuery, filteredData } = useSearch(data)

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">{MESSAGES.LOADING}</div>
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
        <h1>외래어 표기 용례 찾기</h1>
      </header>

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <ResultsTable data={filteredData} query={searchQuery} />

      <Footer />
    </div>
  )
}

export default App
