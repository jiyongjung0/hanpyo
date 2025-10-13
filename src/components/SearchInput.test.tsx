import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('입력값과 플레이스홀더를 렌더링한다', () => {
    render(<SearchInput value="" onChange={vi.fn()} />)

    const input = screen.getByPlaceholderText(/원어 표기를 입력하세요/)
    expect(input).toBeInTheDocument()
  })

  it('입력값이 변경되면 onChange가 호출된다', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<SearchInput value="" onChange={handleChange} />)

    const input = screen.getByPlaceholderText(/원어 표기를 입력하세요/)
    await user.type(input, 'Josie')

    expect(handleChange).toHaveBeenCalled()
  })

  it('검색어가 있고 resultCount가 제공되면 결과 개수를 표시한다', () => {
    render(<SearchInput value="test" onChange={vi.fn()} resultCount={5} />)

    expect(screen.getByText(/검색 결과: 5개/)).toBeInTheDocument()
  })

  it('검색어가 없으면 결과 개수를 표시하지 않는다', () => {
    render(<SearchInput value="" onChange={vi.fn()} resultCount={5} />)

    expect(screen.queryByText(/검색 결과/)).not.toBeInTheDocument()
  })

  it('resultCount가 제공되지 않으면 결과 개수를 표시하지 않는다', () => {
    render(<SearchInput value="test" onChange={vi.fn()} />)

    expect(screen.queryByText(/검색 결과/)).not.toBeInTheDocument()
  })
})
