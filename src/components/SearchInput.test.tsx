import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

  describe('UX 기능', () => {
    it('컴포넌트가 마운트되면 입력창에 자동으로 포커스된다', () => {
      render(<SearchInput value="" onChange={vi.fn()} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveFocus()
    })

    it('입력값이 있으면 clear 버튼이 표시된다', () => {
      render(<SearchInput value="test" onChange={vi.fn()} />)
      const clearButton = screen.getByRole('button', { name: /입력 내용 지우기/i })
      expect(clearButton).toBeInTheDocument()
    })

    it('입력값이 없으면 clear 버튼이 표시되지 않는다', () => {
      render(<SearchInput value="" onChange={vi.fn()} />)
      const clearButton = screen.queryByRole('button', { name: /입력 내용 지우기/i })
      expect(clearButton).not.toBeInTheDocument()
    })

    it('clear 버튼 클릭 시 입력값이 지워진다', () => {
      const mockOnChange = vi.fn()
      render(<SearchInput value="test" onChange={mockOnChange} />)

      const clearButton = screen.getByRole('button', { name: /입력 내용 지우기/i })
      fireEvent.click(clearButton)

      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    it('clear 버튼 클릭 후 입력창에 포커스가 유지된다', () => {
      const mockOnChange = vi.fn()
      render(<SearchInput value="test" onChange={mockOnChange} />)

      const clearButton = screen.getByRole('button', { name: /입력 내용 지우기/i })
      const input = screen.getByRole('textbox')

      fireEvent.click(clearButton)

      expect(input).toHaveFocus()
    })

    it('ESC 키를 누르면 입력값이 지워진다', () => {
      const mockOnChange = vi.fn()
      render(<SearchInput value="test" onChange={mockOnChange} />)

      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Escape' })

      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    it('Enter 키를 누르면 텍스트가 전체 선택된다', () => {
      render(<SearchInput value="test" onChange={vi.fn()} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      const selectSpy = vi.spyOn(input, 'select')

      fireEvent.keyDown(input, { key: 'Enter' })

      expect(selectSpy).toHaveBeenCalled()
    })
  })
})
