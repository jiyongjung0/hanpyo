import { useState, useEffect } from 'react'

/**
 * 조건이 참일 때 지연 후 메시지를 표시하는 훅
 * @param condition 메시지를 표시할 조건
 * @param delay 메시지 표시 지연 시간 (밀리초)
 * @returns 메시지 표시 여부
 */
export const useDelayedMessage = (condition: boolean, delay: number): boolean => {
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (condition) {
      const timer = setTimeout(() => {
        setShowMessage(true)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      setShowMessage(false)
    }
  }, [condition, delay])

  return showMessage
}
