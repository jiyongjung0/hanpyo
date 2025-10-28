import type { ForeignWordEntry } from '../types/ForeignWord'
import { isValidSearchQuery } from '../utils/search'
import { highlightText } from '../utils/highlight'
import styles from './ResultsTable.module.css'
import { MESSAGES } from '../constants/messages'
import { TIMING } from '../constants/timing'
import { useDelayedMessage } from '../hooks/useDelayedMessage'

interface ResultsTableProps {
  data: ForeignWordEntry[]
  query: string
}

export const ResultsTable = ({ data, query }: ResultsTableProps) => {
  // 검색어가 유효하지 않을 때 - 딜레이 후 메시지 표시
  const isInvalid = Boolean(query.trim() && !isValidSearchQuery(query))
  const showInvalidMessage = useDelayedMessage(isInvalid, TIMING.INVALID_QUERY_DELAY)

  // 검색어가 없을 때
  if (!query.trim()) {
    return <div className={`${styles.resultsSection} ${styles.empty}`}></div>
  }

  if (isInvalid && !showInvalidMessage) {
    return <div className={`${styles.resultsSection} ${styles.empty}`}></div>
  }

  if (isInvalid && showInvalidMessage) {
    return (
      <div className={styles.resultsSection}>
        <div className={styles.noResults} role="status" aria-live="polite">
          {MESSAGES.INVALID_QUERY}
        </div>
      </div>
    )
  }

  // 검색 결과가 없을 때
  if (data.length === 0) {
    return (
      <div className={styles.resultsSection}>
        <div className={styles.noResults} role="status" aria-live="polite">
          {MESSAGES.NO_RESULTS}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.resultsSection}>
      <div
        className={styles.resultCount}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {MESSAGES.RESULTS_COUNT(data.length)}
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <caption className="visually-hidden">
            {MESSAGES.SEARCH_RESULTS_CAPTION}
          </caption>
          <thead>
            <tr>
              <th>원어 표기</th>
              <th>한글 표기</th>
              <th>구분</th>
              <th>언어명</th>
              <th>국명</th>
              <th>의미</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={`${entry['원어 표기']}-${index}`}>
                <td data-label="원어 표기" className={styles.originalText}>{highlightText(entry['원어 표기'], query)}</td>
                <td data-label="한글 표기" className={styles.koreanText}>{entry['한글 표기']}</td>
                <td data-label="구분">{entry.구분}</td>
                <td data-label="언어명">{entry.언어명}</td>
                <td data-label="국명">{entry.국명}</td>
                <td data-label="의미" className={styles.meaningText}>{entry.의미}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
