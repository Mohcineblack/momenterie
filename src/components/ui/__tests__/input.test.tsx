import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('handles text input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Enter text" />)

    const input = screen.getByPlaceholderText('Enter text')
    await user.type(input, 'Hello World')

    expect(input).toHaveValue('Hello World')
  })

  it('handles onChange callback', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()

    render(<Input onChange={handleChange} placeholder="Enter text" />)

    const input = screen.getByPlaceholderText('Enter text')
    await user.type(input, 'Test')

    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toHaveBeenCalledTimes(4) // Once for each character
  })

  it('renders with different types', () => {
    const { rerender } = render(<Input type="text" data-testid="input" />)
    let input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'text')

    rerender(<Input type="email" data-testid="input" />)
    input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" data-testid="input" />)
    input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type="number" data-testid="input" />)
    input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('renders as disabled', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('custom-input')
  })

  it('supports ref forwarding', () => {
    const ref = jest.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('renders with default value', () => {
    render(<Input defaultValue="Default text" data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement
    expect(input.value).toBe('Default text')
  })

  it('renders with controlled value', () => {
    const { rerender } = render(<Input value="Initial" onChange={() => {}} data-testid="input" />)
    let input = screen.getByTestId('input') as HTMLInputElement
    expect(input.value).toBe('Initial')

    rerender(<Input value="Updated" onChange={() => {}} data-testid="input" />)
    input = screen.getByTestId('input') as HTMLInputElement
    expect(input.value).toBe('Updated')
  })

  it('renders with required attribute', () => {
    render(<Input required data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toBeRequired()
  })

  it('renders with maxLength attribute', () => {
    render(<Input maxLength={10} data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('maxLength', '10')
  })
})
