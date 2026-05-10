import { render, screen, act } from '@testing-library/react'
import DreamPage from '@/app/dream/page'
import { fetchBeliefs } from '@/app/actions'

jest.mock('@/app/actions', () => ({
  fetchBeliefs: jest.fn(),
  handleSearch: jest.fn(),
}))

const mockDreamData = [
  {
    id: 'dream-snake',
    title: 'ฝันเห็นงู',
    description: 'ความหมายฝันเห็นงู',
    luckyNumbers: ['5', '6'],
    category: 'สัตว์'
  }
]

describe('DreamPage', () => {
  it('renders dream list', async () => {
    ;(fetchBeliefs as jest.Mock).mockResolvedValue(mockDreamData)
    
    await act(async () => {
      render(<DreamPage />)
    })

    expect(screen.getByText(/คลังคำทำนายฝัน/i)).toBeInTheDocument()
    expect(screen.getByText('ฝันเห็นงู')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
