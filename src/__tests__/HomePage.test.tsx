import { render, screen, act } from '@testing-library/react'
import HomePage from '@/app/page'
import { fetchFrequencyData } from '@/app/actions'

// Mock the server action
jest.mock('@/app/actions', () => ({
  fetchFrequencyData: jest.fn(),
}))

const mockData = {
  prize1: [{ number: '123456', count: 5 }],
  prize2: [],
  prize3: [],
  prize4: [],
  prize5: [],
  front3: [],
  back3: [],
  back2: [{ number: '12', count: 10 }],
}

describe('HomePage', () => {
  it('renders the hero section and slogan', async () => {
    ;(fetchFrequencyData as jest.Mock).mockResolvedValue(mockData)
    
    await act(async () => {
      render(<HomePage />)
    })
    
    expect(screen.getByText(/งวดนี้แหละ/i)).toBeInTheDocument()
    expect(screen.getByText(/คู่คิดด้านข้อมูลเชิงสถิติ/i)).toBeInTheDocument()
  })

  it('displays top frequent numbers after loading', async () => {
    ;(fetchFrequencyData as jest.Mock).mockResolvedValue(mockData)
    
    await act(async () => {
      render(<HomePage />)
    })
    
    expect(screen.getByText('123456')).toBeInTheDocument()
    expect(screen.getByText('5 ครั้ง')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('10 ครั้ง')).toBeInTheDocument()
  })
})
