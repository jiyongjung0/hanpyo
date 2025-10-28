import { useEffect, type RefObject } from 'react'

/**
 * 전역 키보드 이벤트를 감지하여 입력창에 자동 포커스하는 훅
 * @param inputRef 포커스할 입력 요소의 ref
 */
export const useGlobalKeyboardFocus = (inputRef: RefObject<HTMLInputElement | null>) => {
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 이미 입력창에 포커스가 있으면 무시
      if (document.activeElement === inputRef.current) {
        return
      }

      // 스페이스바, 혹은 modifier 키와 함께 눌린 경우 무시 (Ctrl+C, Cmd+V 등)
      if (e.ctrlKey || e.altKey || e.metaKey || e.key === ' ') {
        return
      }

      // 입력 가능한 단일 문자인 경우에만 포커스 이동
      if (e.key.length === 1) {
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [inputRef])
}
