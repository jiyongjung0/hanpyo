import type { ForeignWordEntry } from '../types/ForeignWord'

export const filterByOriginalText = (
  data: ForeignWordEntry[],
  query: string,
  minLength: number = 2
): ForeignWordEntry[] => {
  const trimmedQuery = query.trim()

  if (!trimmedQuery || trimmedQuery.length < minLength) {
    return []
  }

  const normalizedQuery = trimmedQuery.toLowerCase()
  return data.filter((entry) =>
    entry['원어 표기']?.toLowerCase().includes(normalizedQuery)
  )
}
