import { render, screen, act } from '@testing-library/react'
import ArchivePage from '@/app/archive/page'
import { fetchYearlyArchive } from '@/app/actions'

jest.mock('@/app/actions', () => ({
  fetchYearlyArchive: jest.fn(),
}))

const mockArchiveData = [
  {
    date: '1 มกราคม 2567',
    endpoint: '',
    prizes: [{ id: 'prizeFirst', name: 'รางวัลที่ 1', reward: '6000000', amount: 1, number: ['123456'] }],
    runningNumbers: [{ id: 'runningNumberBackTwo', name: 'เลขท้าย 2 ตัว', reward: '2000', amount: 1, number: ['12'] }]
  },
  {
    date: '16 มกราคม 2567',
    endpoint: '',
    prizes: [{ id: 'prizeFirst', name: 'รางวัลที่ 1', reward: '6000000', amount: 1, number: ['654321'] }],
    runningNumbers: [{ id: 'runningNumberBackTwo', name: 'เลขท้าย 2 ตัว', reward: '2000', amount: 1, number: ['21'] }]
  }
]

describe('ArchivePage', () => {
  it('renders archive page and performs sorting', async () => {
    ;(fetchYearlyArchive as jest.Mock).mockResolvedValue(mockArchiveData)
    
    await act(async () => {
      render(<ArchivePage />)
    })

    expect(screen.getByText(/สถิติรายปี/i)).toBeInTheDocument()
    
    // Check for dates
    expect(screen.getByText('1 มกราคม 2567')).toBeInTheDocument()
    expect(screen.getByText('16 มกราคม 2567')).toBeInTheDocument()
    
    // Check if the latest date appears first in the list
    const dateElements = screen.getAllByText(/\d+ .* \d{4}/)
    expect(dateElements[0].textContent).toContain('16 มกราคม 2567')
    expect(dateElements[1].textContent).toContain('1 มกราคม 2567')
  })
})
