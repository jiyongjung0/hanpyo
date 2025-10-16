import type { ForeignWordEntry } from '../types/ForeignWord'

export const isValidSearchQuery = (query: string): boolean => {
  const trimmedQuery = query.trim()

  if (trimmedQuery.length === 0) {
    return false
  } else if (trimmedQuery.length >= 2) { // 2글자 이상이면 무조건 유효
    return true
  }

  // 1글자인 경우: 영어 알파벳이 아니면 유효 (한자, 한글 등)
  return !/^[a-zA-Z]$/.test(trimmedQuery)
}

export const filterByOriginalText = (
  data: ForeignWordEntry[],
  query: string
): ForeignWordEntry[] => {
  if (!isValidSearchQuery(query)) {
    return []
  }

  const normalizedQuery = query.trim().toLowerCase()

  // 정규식 특수 문자를 escape (한 번만 수행)
  const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const wordBoundaryStart = new RegExp(`\\b${escapedQuery}`)
  const wordBoundaryEnd = new RegExp(`${escapedQuery}\\b`)

  // 우선순위별 그룹
  const exactMatch: ForeignWordEntry[] = []
  const wordExactMatch: ForeignWordEntry[] = []
  const startsWithQuery: ForeignWordEntry[] = []
  const wordBoundaryStartMatch: ForeignWordEntry[] = []
  const endsWithQuery: ForeignWordEntry[] = []
  const wordPartialOrBoundaryEnd: ForeignWordEntry[] = []
  const contains: ForeignWordEntry[] = []

  // 한 번의 순회로 모든 항목을 분류
  data.forEach((entry) => {
    const text = entry['원어 표기']?.toLowerCase() || ''

    // 검색어를 포함하지 않으면 스킵
    if (!text.includes(normalizedQuery)) {
      return
    }

    // 완전 일치
    if (text === normalizedQuery) {
      exactMatch.push(entry)
    }
    // 단어 단위 완전 일치
    else if (text.split(/\s+/).includes(normalizedQuery)) {
      wordExactMatch.push(entry)
    }
    // 전체 시작
    else if (text.startsWith(normalizedQuery)) {
      startsWithQuery.push(entry)
    }
    // 단어 경계에서 시작
    else if (wordBoundaryStart.test(text)) {
      wordBoundaryStartMatch.push(entry)
    }
    // 전체 끝
    else if (text.endsWith(normalizedQuery)) {
      endsWithQuery.push(entry)
    }
    // 단어 경계 끝
    else if (wordBoundaryEnd.test(text)) {
      wordPartialOrBoundaryEnd.push(entry)
    }
    // 중간 포함
    else {
      contains.push(entry)
    }
  })

  // 각 그룹을 원어 표기 길이 순으로 정렬 (짧을수록 일치율이 높음)
  const sortByLength = (a: ForeignWordEntry, b: ForeignWordEntry) =>
    a['원어 표기'].length - b['원어 표기'].length

  // 우선순위 순서대로 병합 (exactMatch는 정렬 불필요)
  return [
    ...exactMatch,
    ...wordExactMatch.sort(sortByLength),
    ...startsWithQuery.sort(sortByLength),
    ...wordBoundaryStartMatch.sort(sortByLength),
    ...endsWithQuery.sort(sortByLength),
    ...wordPartialOrBoundaryEnd.sort(sortByLength),
    ...contains.sort(sortByLength),
  ]
}
