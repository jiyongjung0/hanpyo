import type { ReactNode } from 'react'

/**
 * 텍스트에서 검색어와 일치하는 부분을 <strong> 태그로 강조하여 반환
 * @param text 원본 텍스트
 * @param query 검색어
 * @returns 강조 표시가 적용된 JSX 요소 배열
 */
export function highlightText(text: string, query: string): ReactNode {
  if (!query.trim()) {
    return text
  }

  // 정규식 특수 문자를 escape
  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // 대소문자 구분 없이 매칭
  const regex = new RegExp(`(${escapedQuery})`, 'gi')

  const parts = text.split(regex)

  return parts.map((part, index) => {
    // 검색어와 일치하는 부분인지 확인 (대소문자 무시)
    if (part.toLowerCase() === query.trim().toLowerCase()) {
      return (
        <strong key={index}>{part}</strong>
      )
    }
    return part
  })
}
