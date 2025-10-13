import type { ForeignWordEntry } from '../types/ForeignWord'

export const filterByOriginalText = (
  data: ForeignWordEntry[],
  query: string
): ForeignWordEntry[] => {
  if (!query.trim()) {
    return []
  }

  const normalizedQuery = query.toLowerCase()
  return data.filter((entry) =>
    entry['원어 표기']?.toLowerCase().includes(normalizedQuery)
  )
}
