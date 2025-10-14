import type { ForeignWordEntry } from '../types/ForeignWord'
import { isValidSearchQuery } from '../utils/search'

interface ResultsTableProps {
  data: ForeignWordEntry[]
  query: string
}

export const ResultsTable = ({ data, query }: ResultsTableProps) => {
  if (!isValidSearchQuery(query)) {
    return <div className="no-results">영어는 두 글자 이상 입력해주세요.</div>
  }

  if (data.length === 0) {
    return <div className="no-results">검색 결과가 없습니다.</div>
  }

  return (
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
          {data.map((entry, index) => (
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
  )
}
