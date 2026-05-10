import { render, screen, fireEvent, act } from '@testing-library/react'
import SearchPage from '@/app/search/page'
import { handleSearch } from '@/app/actions'

jest.mock('@/app/actions', () => ({
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

const mockSearchResults = [
  { date: '1 มกราคม 2567', prizeName: 'รางวัลที่ 1', reward: '6000000', fullNumber: '123456', prizeId: 'prizeFirst' }
]

describe('SearchPage', () => {
  it('renders search input', () => {
    render(<SearchPage />)
    expect(screen.getByPlaceholderText(/พิมพ์เลขที่ต้องการ/i)).toBeInTheDocument()
  })

  it('performs search and displays results', async () => {
    ;(handleSearch as jest.Mock).mockResolvedValue(mockSearchResults)
    
    render(<SearchPage />)
    const input = screen.getByPlaceholderText(/พิมพ์เลขที่ต้องการ/i)
    
    await act(async () => {
      fireEvent.change(input, { target: { value: '123' } })
    })

    expect(handleSearch).toHaveBeenCalledWith('123')
    
    // Use findByText with a function matcher because the number is split into parts for highlighting
    const resultElement = await screen.findByText((content, element) => {
      return element?.textContent === '123456'
    })
    expect(resultElement).toBeInTheDocument()
    
    // Use getAllByText for prize names since it appears in both the filter button and results
    const prizeElements = screen.getAllByText(/รางวัลที่ 1/i)
    expect(prizeElements.length).toBeGreaterThan(1)
  })
})
