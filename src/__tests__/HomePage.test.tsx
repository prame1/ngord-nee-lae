import { render, screen, act } from '@testing-library/react'
import HomePage from '@/app/page'
import { fetchFrequencyData, fetchLatestDrawData } from '@/app/actions'

// Mock the server action
jest.mock('@/app/actions', () => ({
  fetchFrequencyData: jest.fn(),
  fetchLatestDrawData: jest.fn(),
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

const mockLatest = {
  date: '1 มกราคม 2569',
  endpoint: '',
  prizes: []
}

describe('HomePage', () => {
  it('renders the hero section and slogan', async () => {
    ;(fetchFrequencyData as jest.Mock).mockResolvedValue(mockData)
    ;(fetchLatestDrawData as jest.Mock).mockResolvedValue(mockLatest)
    
    await act(async () => {
      render(<HomePage />)
    })
    
    expect(screen.getByText(/งวดนี้แหละ/i)).toBeInTheDocument()
  })

  it('displays top frequent numbers after loading', async () => {
    ;(fetchFrequencyData as jest.Mock).mockResolvedValue(mockData)
    ;(fetchLatestDrawData as jest.Mock).mockResolvedValue(mockLatest)
    
    await act(async () => {
      render(<HomePage />)
    })
    
    // Check for number and its occurrence text
    expect(screen.getByText('123456')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
