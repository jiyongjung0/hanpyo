import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { loadCSVData } from './utils/csvLoader'
import type { ForeignWordEntry } from './types/ForeignWord'

function App() {
  const [data, setData] = useState<ForeignWordEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const csvData = await loadCSVData()
        setData(csvData)
        setError(null)
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return data.filter((entry) =>
      entry['원어 표기']?.toLowerCase().includes(query)
    )
  }, [data, searchQuery])

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

      <div className="search-section">
        <input
          type="text"
          placeholder="원어 표기를 입력하세요 (예: Josie)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <div className="result-count">
            검색 결과: {filteredData.length}개
          </div>
        )}
      </div>

      {searchQuery && filteredData.length > 0 && (
        <div className="results-section">
          <table className="results-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>한글 표기</th>
                <th>원어 표기</th>
                <th>언어명</th>
                <th>국명</th>
                <th>의미</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => (
                <tr key={`${entry.번호}-${index}`}>
                  <td>{entry.구분}</td>
                  <td className="korean-text">{entry['한글 표기']}</td>
                  <td className="original-text">{entry['원어 표기']}</td>
                  <td>{entry.언어명}</td>
                  <td>{entry.국명}</td>
                  <td className="meaning-text">{entry.의미}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {searchQuery && filteredData.length === 0 && (
        <div className="no-results">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  )
}

export default App
