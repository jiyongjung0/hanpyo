import { useState, useEffect } from 'react'
import type { ForeignWordEntry } from '../types/ForeignWord'
import { isValidSearchQuery } from '../utils/search'

interface ResultsTableProps {
  data: ForeignWordEntry[]
  query: string
}

export const ResultsTable = ({ data, query }: ResultsTableProps) => {
  const [showInvalidMessage, setShowInvalidMessage] = useState(false)

  // 검색어가 유효하지 않을 때 - 1초 딜레이
  const isInvalid = query.trim() && !isValidSearchQuery(query)

  useEffect(() => {
    if (isInvalid) {
      const timer = setTimeout(() => {
        setShowInvalidMessage(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setShowInvalidMessage(false)
    }
  }, [isInvalid])

  // 검색어가 없을 때
  if (!query.trim()) {
    return <div className="results-section empty"></div>
  }

  if (isInvalid && !showInvalidMessage) {
    return <div className="results-section empty"></div>
  }

  if (isInvalid && showInvalidMessage) {
    return (
      <div className="results-section">
        <div className="no-results">영어는 두 글자 이상 입력해주세요.</div>
      </div>
    )
  }

  // 검색 결과가 없을 때
  if (data.length === 0) {
    return (
      <div className="results-section">
        <div className="no-results">검색 결과가 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="results-section">
      <div className="result-count">
        검색 결과: {data.length}개
      </div>
      <table className="results-table">
        <thead>
          <tr>
            <th>구분</th>
            <th>원어 표기</th>
            <th>한글 표기</th>
            <th>언어명</th>
            <th>국명</th>
            <th>의미</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={`${entry['원어 표기']}-${index}`}>
              <td>{entry.구분}</td>
              <td className="original-text">{entry['원어 표기']}</td>
              <td className="korean-text">{entry['한글 표기']}</td>
              <td>{entry.언어명}</td>
              <td>{entry.국명}</td>
              <td className="meaning-text">{entry.의미}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
