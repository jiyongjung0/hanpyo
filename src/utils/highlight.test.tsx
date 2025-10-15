import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { highlightText } from './highlight'

describe('highlightText', () => {
  it('빈 검색어일 때 원본 텍스트를 반환한다', () => {
    const result = highlightText('Hello World', '')
    expect(result).toBe('Hello World')
  })

  it('공백만 있는 검색어일 때 원본 텍스트를 반환한다', () => {
    const result = highlightText('Hello World', '   ')
    expect(result).toBe('Hello World')
  })

  it('일치하는 부분을 strong 태그로 감싼다', () => {
    const result = highlightText('Hello World', 'World')
    const { container } = render(<>{result}</>)

    expect(container.textContent).toBe('Hello World')
    expect(container.querySelector('strong')).toBeTruthy()
    expect(container.querySelector('strong')?.textContent).toBe('World')
  })

  it('대소문자 구분 없이 매칭한다', () => {
    const result = highlightText('Hello World', 'world')
    const { container } = render(<>{result}</>)

    expect(container.querySelector('strong')?.textContent).toBe('World')
  })

  it('여러 개 일치하는 경우 모두 강조한다', () => {
    const result = highlightText('hello hello hello', 'hello')
    const { container } = render(<>{result}</>)

    const strongs = container.querySelectorAll('strong')
    expect(strongs).toHaveLength(3)
    strongs.forEach(strong => {
      expect(strong.textContent).toBe('hello')
    })
  })

  it('특수문자가 포함된 검색어를 올바르게 처리한다', () => {
    const result = highlightText('Test (example)', '(example)')
    const { container } = render(<>{result}</>)

    expect(container.querySelector('strong')?.textContent).toBe('(example)')
  })

  it('일치하지 않는 경우 강조 없이 원본을 반환한다', () => {
    const result = highlightText('Hello World', 'xyz')
    const { container } = render(<>{result}</>)

    expect(container.textContent).toBe('Hello World')
    expect(container.querySelector('strong')).toBeFalsy()
  })

  it('부분 일치하는 경우 해당 부분만 강조한다', () => {
    const result = highlightText('JavaScript', 'Java')
    const { container } = render(<>{result}</>)

    expect(container.textContent).toBe('JavaScript')
    expect(container.querySelector('strong')?.textContent).toBe('Java')
  })
})
