import { useState, useMemo } from 'react'
import type { ForeignWordEntry } from '../types/ForeignWord'
import { filterByOriginalText } from '../utils/searchUtils'

export const useSearch = (data: ForeignWordEntry[]) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    return filterByOriginalText(data, searchQuery)
  }, [data, searchQuery])

  return { searchQuery, setSearchQuery, filteredData }
}
