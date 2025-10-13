import { useState, useEffect } from 'react'
import { loadCSVData } from '../utils/csvLoader'
import type { ForeignWordEntry } from '../types/ForeignWord'

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
        setError('데이터를 불러오는데 실패했습니다.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
