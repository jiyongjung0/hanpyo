import { describe, it, expect } from 'vitest'
import { filterByOriginalText, isValidSearchQuery } from './search'
import type { ForeignWordEntry } from '../types/ForeignWord'

describe('search', () => {
  describe('isValidSearchQuery', () => {
    it('빈 문자열은 유효하지 않다', () => {
      expect(isValidSearchQuery('')).toBe(false)
    })

    it('공백만 있는 문자열은 유효하지 않다', () => {
      expect(isValidSearchQuery('   ')).toBe(false)
    })

    it('영어 알파벳 1글자는 유효하지 않다', () => {
      expect(isValidSearchQuery('a')).toBe(false)
      expect(isValidSearchQuery('Z')).toBe(false)
    })

    it('한자 1글자는 유효하다', () => {
      expect(isValidSearchQuery('深')).toBe(true)
    })

    it('한글 1글자는 유효하다', () => {
      expect(isValidSearchQuery('가')).toBe(true)
    })

    it('키릴 문자 1글자는 유효하다', () => {
      expect(isValidSearchQuery('А')).toBe(true)
    })

    it('영어 알파벳 2글자 이상은 유효하다', () => {
      expect(isValidSearchQuery('ab')).toBe(true)
      expect(isValidSearchQuery('abc')).toBe(true)
    })

    it('공백이 포함된 2글자 이상은 유효하다', () => {
      expect(isValidSearchQuery('  ab  ')).toBe(true)
    })
  })

  describe('filterByOriginalText', () => {
    const mockData: ForeignWordEntry[] = [
      {
        구분: '인명',
        '한글 표기': '하우스, 조시',
        '원어 표기': 'Josie Howse',
        국명: '오스트레일리아',
        언어명: '영어',
        의미: '오스트레일리아의 점자 연구자.',
      },
      {
        구분: '인명',
        '한글 표기': '파월, 제롬',
        '원어 표기': 'Jerome Powell',
        국명: '미국',
        언어명: '영어',
        의미: '미국 금융인.',
      },
      {
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

    it('대소문자 구분 없이 검색한다', () => {
      const result = filterByOriginalText(mockData, 'josie')
      expect(result).toHaveLength(1)
      expect(result[0]['원어 표기']).toBe('Josie Howse')
    })

    it('부분 일치로 검색한다', () => {
      const result = filterByOriginalText(mockData, 'ow')
      expect(result).toHaveLength(2)
      // 두 항목 모두 포함 카테고리이므로 원래 순서 유지
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

    describe('관련도 순 정렬', () => {
      const priorityTestData: ForeignWordEntry[] = [
        {
          구분: '인명',
          '한글 표기': '포함 항목',
          '원어 표기': 'something tech here',
          국명: '미국',
          언어명: '영어',
          의미: 'tech가 중간에 포함',
        },
        {
          구분: '인명',
          '한글 표기': '시작 항목',
          '원어 표기': 'tech world',
          국명: '미국',
          언어명: '영어',
          의미: 'tech로 시작',
        },
        {
          구분: '인명',
          '한글 표기': '끝 항목',
          '원어 표기': 'high tech',
          국명: '미국',
          언어명: '영어',
          의미: 'tech로 끝남',
        },
        {
          구분: '인명',
          '한글 표기': '완전일치 항목',
          '원어 표기': 'tech',
          국명: '미국',
          언어명: '영어',
          의미: 'tech 정확히 일치',
        },
      ]

      it('완전일치 > 시작 > 끝 > 포함 순으로 정렬한다', () => {
        const result = filterByOriginalText(priorityTestData, 'tech')
        expect(result).toHaveLength(4)
        expect(result[0]['원어 표기']).toBe('tech')                   // 완전일치
        // 'tech world'와 'high tech'는 단어 단위 완전 일치, 길이 순으로 정렬
        expect(result[1]['원어 표기']).toBe('high tech')              // 단어 단위 완전 일치 (9글자)
        expect(result[2]['원어 표기']).toBe('tech world')             // 단어 단위 완전 일치 (10글자)
        expect(result[3]['원어 표기']).toBe('something tech here')    // 단어 단위 완전 일치 (19글자)
      })

      it('대소문자 무관하게 우선순위를 적용한다', () => {
        const result = filterByOriginalText(priorityTestData, 'TECH')
        expect(result).toHaveLength(4)
        expect(result[0]['원어 표기']).toBe('tech')                   // 완전일치
        // 길이 순으로 정렬
        expect(result[1]['원어 표기']).toBe('high tech')              // 단어 단위 완전 일치 (9글자)
        expect(result[2]['원어 표기']).toBe('tech world')             // 단어 단위 완전 일치 (10글자)
        expect(result[3]['원어 표기']).toBe('something tech here')    // 단어 단위 완전 일치 (19글자)
      })
    })

    describe('단어 경계 매칭', () => {
      const wordBoundaryData: ForeignWordEntry[] = [
        {
          구분: '인명',
          '한글 표기': '중간 포함',
          '원어 표기': 'Jerowell Smith',
          국명: '미국',
          언어명: '영어',
          의미: 'well이 단어 중간에 포함',
        },
        {
          구분: '인명',
          '한글 표기': '단어 경계 시작',
          '원어 표기': 'George Well',
          국명: '미국',
          언어명: '영어',
          의미: 'well이 단어 경계에서 시작',
        },
        {
          구분: '인명',
          '한글 표기': '단어 경계 끝',
          '원어 표기': 'Well Known',
          국명: '미국',
          언어명: '영어',
          의미: 'well이 단어 경계에서 끝남',
        },
        {
          구분: '인명',
          '한글 표기': '전체 시작',
          '원어 표기': 'Wellington',
          국명: '영국',
          언어명: '영어',
          의미: 'well로 시작',
        },
        {
          구분: '일반 용어',
          '한글 표기': '완전 일치',
          '원어 표기': 'well',
          국명: '미국',
          언어명: '영어',
          의미: 'well 그 자체',
        },
      ]

      it('단어 경계 매칭을 고려하여 정렬한다', () => {
        const result = filterByOriginalText(wordBoundaryData, 'well')
        expect(result).toHaveLength(5)

        // 우선순위: 완전일치 > 단어단위완전일치 > 전체시작 > 단어경계시작 > 나머지
        expect(result[0]['원어 표기']).toBe('well')             // 완전 일치
        // 단어 단위 완전 일치는 길이 순으로 정렬
        expect(result[1]['원어 표기']).toBe('Well Known')       // 단어 단위 완전 일치 (10글자)
        expect(result[2]['원어 표기']).toBe('George Well')      // 단어 단위 완전 일치 (11글자)
        expect(result[3]['원어 표기']).toBe('Wellington')       // 전체 시작
        expect(result[4]['원어 표기']).toBe('Jerowell Smith')   // 중간 포함
      })

      it('Powell 검색 시 "Jerome Powell"이 "Powellson"보다 우선한다', () => {
        const powellData: ForeignWordEntry[] = [
          {
            구분: '인명',
            '한글 표기': '파월슨',
            '원어 표기': 'Powellson',
            국명: '미국',
            언어명: '영어',
            의미: 'Powell로 시작하는 성',
          },
          {
            구분: '인명',
            '한글 표기': '파월, 제롬',
            '원어 표기': 'Jerome Powell',
            국명: '미국',
            언어명: '영어',
            의미: '미국 금융인',
          },
        ]

        const result = filterByOriginalText(powellData, 'Powell')
        expect(result).toHaveLength(2)
        expect(result[0]['원어 표기']).toBe('Jerome Powell') // 단어 단위 완전 일치
        expect(result[1]['원어 표기']).toBe('Powellson')     // 전체 시작
      })

      it('대소문자 무관하게 단어 경계를 인식한다', () => {
        const result = filterByOriginalText(wordBoundaryData, 'WELL')
        expect(result).toHaveLength(5)
        expect(result[0]['원어 표기']).toBe('well')
        // 길이 순으로 정렬
        expect(result[1]['원어 표기']).toBe('Well Known')    // 단어 단위 완전 일치 (10글자)
        expect(result[2]['원어 표기']).toBe('George Well')   // 단어 단위 완전 일치 (11글자)
        expect(result[3]['원어 표기']).toBe('Wellington')
      })
    })
  })
})
