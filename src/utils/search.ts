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
  return data.filter((entry) =>
    entry['원어 표기']?.toLowerCase().includes(normalizedQuery)
  )
}
