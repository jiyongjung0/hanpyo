import { useState, useEffect } from 'react'
import { loadCSVData } from '../utils/csvLoader'
import type { ForeignWordEntry } from '../types/ForeignWord'
import { MESSAGES } from '../constants/messages'

export const useForeignWordData = () => {
  const [data, setData] = useState<ForeignWordEntry[]>([])
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
        setError(MESSAGES.LOAD_ERROR)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
