import type { ForeignWordEntry } from '../types/ForeignWord'

export const isValidSearchQuery = (query: string, minLength: number = 2): boolean => {
  const trimmedQuery = query.trim()
  return trimmedQuery.length >= minLength
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
