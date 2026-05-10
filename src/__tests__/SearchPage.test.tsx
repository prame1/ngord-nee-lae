import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import SearchPage from '@/app/search/page'
import { fetchAllDraws } from '@/app/actions'

jest.mock('@/app/actions', () => ({
  fetchAllDraws: jest.fn(),
  handleSearch: jest.fn(),
}))

// Mock Recharts to avoid issues in JSDOM
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Cell: () => <div />,
}))

const mockAllDraws = [
  {
    date: '1 มกราคม 2567',
    endpoint: '',
    prizes: [{ id: 'prizeFirst', name: 'รางวัลที่ 1', reward: '6000000', amount: 1, number: ['123456'] }],
    runningNumbers: []
  }
]

describe('SearchPage', () => {
  it('renders search input after loading data', async () => {
    ;(fetchAllDraws as jest.Mock).mockResolvedValue(mockAllDraws)
    
    await act(async () => {
      render(<SearchPage />)
    })

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/พิมพ์เลขที่ต้องการ/i)).toBeInTheDocument()
    })
  })

  it('performs search and displays results locally', async () => {
    ;(fetchAllDraws as jest.Mock).mockResolvedValue(mockAllDraws)
    
    await act(async () => {
      render(<SearchPage />)
    })

    const input = await screen.findByPlaceholderText(/พิมพ์เลขที่ต้องการ/i)
    
    await act(async () => {
      fireEvent.change(input, { target: { value: '123' } })
    })

    // Match the split content
    const resultElement = await screen.findByText((content, element) => {
      return element?.textContent === '123456'
    })
    expect(resultElement).toBeInTheDocument()
  })
})
