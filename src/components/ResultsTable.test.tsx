import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultsTable } from './ResultsTable'
import type { ForeignWordEntry } from '../types/ForeignWord'

describe('ResultsTable', () => {
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
  ]

  it('빈 데이터일 때 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<ResultsTable data={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('테이블 헤더를 렌더링한다', () => {
    render(<ResultsTable data={mockData} />)

    expect(screen.getByText('구분')).toBeInTheDocument()
    expect(screen.getByText('한글 표기')).toBeInTheDocument()
    expect(screen.getByText('원어 표기')).toBeInTheDocument()
    expect(screen.getByText('언어명')).toBeInTheDocument()
    expect(screen.getByText('국명')).toBeInTheDocument()
    expect(screen.getByText('의미')).toBeInTheDocument()
  })

  it('검색 결과 데이터를 렌더링한다', () => {
    render(<ResultsTable data={mockData} />)

    expect(screen.getByText('하우스, 조시')).toBeInTheDocument()
    expect(screen.getByText('Josie Howse')).toBeInTheDocument()
    expect(screen.getByText('오스트레일리아의 점자 연구자.')).toBeInTheDocument()

    expect(screen.getByText('파월, 제롬')).toBeInTheDocument()
    expect(screen.getByText('Jerome Powell')).toBeInTheDocument()
    expect(screen.getByText('미국 금융인.')).toBeInTheDocument()
  })

  it('모든 데이터 행을 렌더링한다', () => {
    render(<ResultsTable data={mockData} />)

    const rows = screen.getAllByRole('row')
    // 헤더 행 + 데이터 행 2개 = 3개
    expect(rows).toHaveLength(3)
  })
})
