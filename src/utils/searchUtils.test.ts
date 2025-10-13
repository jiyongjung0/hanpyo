import { describe, it, expect } from 'vitest'
import { filterByOriginalText } from './searchUtils'
import type { ForeignWordEntry } from '../types/ForeignWord'

describe('searchUtils', () => {
  describe('filterByOriginalText', () => {
    const mockData: ForeignWordEntry[] = [
      {
        번호: '1',
        구분: '인명',
        '한글 표기': '하우스, 조시',
        '원어 표기': 'Josie Howse',
        국명: '오스트레일리아',
        언어명: '영어',
        의미: '오스트레일리아의 점자 연구자.',
      },
      {
        번호: '2',
        구분: '인명',
        '한글 표기': '파월, 제롬',
        '원어 표기': 'Jerome Powell',
        국명: '미국',
        언어명: '영어',
        의미: '미국 금융인.',
      },
      {
        번호: '3',
        구분: '일반 용어',
        '한글 표기': '테초 국제공항',
        '원어 표기': 'Techo',
        국명: '캄보디아',
        언어명: '기타 언어',
        의미: '캄보디아의 국제 공항.',
      },
    ]

    it('빈 문자열로 검색하면 빈 배열을 반환한다', () => {
      const result = filterByOriginalText(mockData, '')
      expect(result).toEqual([])
    })

    it('공백 문자열로 검색하면 빈 배열을 반환한다', () => {
      const result = filterByOriginalText(mockData, '   ')
      expect(result).toEqual([])
    })

    it('한 글자로 검색하면 빈 배열을 반환한다', () => {
      const result = filterByOriginalText(mockData, 'J')
      expect(result).toEqual([])
    })

    it('최소 길이보다 짧으면 빈 배열을 반환한다', () => {
      const result = filterByOriginalText(mockData, 'a', 3)
      expect(result).toEqual([])
    })

    it('대소문자 구분 없이 검색한다', () => {
      const result = filterByOriginalText(mockData, 'josie')
      expect(result).toHaveLength(1)
      expect(result[0]['원어 표기']).toBe('Josie Howse')
    })

    it('부분 일치로 검색한다', () => {
      const result = filterByOriginalText(mockData, 'ow')
      expect(result).toHaveLength(2)
      expect(result[0]['원어 표기']).toBe('Josie Howse')
      expect(result[1]['원어 표기']).toBe('Jerome Powell')
    })

    it('일치하는 항목이 없으면 빈 배열을 반환한다', () => {
      const result = filterByOriginalText(mockData, 'xyz')
      expect(result).toEqual([])
    })

    it('정확한 단어로 검색한다', () => {
      const result = filterByOriginalText(mockData, 'Techo')
      expect(result).toHaveLength(1)
      expect(result[0]['한글 표기']).toBe('테초 국제공항')
    })
  })
})
