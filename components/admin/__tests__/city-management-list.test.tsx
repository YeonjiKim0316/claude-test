import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CityManagementList from '../city-management-list'
import { getAllCitiesForAdmin, deleteCity } from '@/app/actions/admin'
import { CityWithDetails } from '@/lib/database.types'

// Mock the admin actions
jest.mock('@/app/actions/admin', () => ({
  getAllCitiesForAdmin: jest.fn(),
  deleteCity: jest.fn(),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Trash2: ({ className }: { className?: string }) => <svg data-testid="trash-icon" className={className} />,
  AlertCircle: ({ className }: { className?: string }) => <svg data-testid="alert-icon" className={className} />,
}))

describe('CityManagementList', () => {
  const mockCities: CityWithDetails[] = [
    {
      id: '1',
      slug: 'seoul',
      name_ko: '서울',
      name_en: 'Seoul',
      region: 'Asia',
      image_url: 'https://example.com/seoul.jpg',
      rank: 1,
      badge: 'Popular',
      overall_score: 95,
      cost_per_month: 2000000,
      internet_speed: 100,
      like_percentage: 85,
      safety_score: 90,
      budget: '중간',
      korean_region: '수도권',
      environment: ['도시', '카페'],
      best_season: '봄',
      country: '대한민국',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      slug: 'busan',
      name_ko: '부산',
      name_en: 'Busan',
      region: 'Asia',
      image_url: 'https://example.com/busan.jpg',
      rank: 2,
      badge: null,
      overall_score: 88,
      cost_per_month: 1500000,
      internet_speed: 95,
      like_percentage: 80,
      safety_score: 85,
      budget: '저렴',
      korean_region: '영남권',
      environment: ['바다', '도시'],
      best_season: '여름',
      country: '대한민국',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
    {
      id: '3',
      slug: 'jeju',
      name_ko: '제주',
      name_en: 'Jeju',
      region: 'Asia',
      image_url: '',
      rank: 3,
      badge: 'Hidden Gem',
      overall_score: 92,
      cost_per_month: 1800000,
      internet_speed: 80,
      like_percentage: 90,
      safety_score: 95,
      budget: '중간',
      korean_region: '제주권',
      environment: ['자연', '바다'],
      best_season: '가을',
      country: '대한민국',
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset window.confirm and window.alert
    global.confirm = jest.fn()
    global.alert = jest.fn()
  })

  describe('렌더링 테스트', () => {
    it('컴포넌트가 정상적으로 렌더링되는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })
    })

    it('로딩 상태가 표시되는지', () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      render(<CityManagementList />)

      expect(screen.getByText('도시 목록을 불러오는 중...')).toBeInTheDocument()
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('데이터 로드 테스트', () => {
    it('getAllCitiesForAdmin() 호출 확인', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(getAllCitiesForAdmin).toHaveBeenCalledTimes(1)
      })
    })

    it('성공 시 도시 목록이 표시되는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
        expect(screen.getAllByText('부산').length).toBeGreaterThan(0)
        expect(screen.getAllByText('제주').length).toBeGreaterThan(0)
      })
    })

    it('각 도시의 정보가 올바르게 표시되는지 - 이름', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Seoul').length).toBeGreaterThan(0)
        expect(screen.getAllByText('부산').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Busan').length).toBeGreaterThan(0)
      })
    })

    it('각 도시의 정보가 올바르게 표시되는지 - 국가/지역', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('대한민국').length).toBeGreaterThan(0)
        expect(screen.getAllByText('수도권').length).toBeGreaterThan(0)
        expect(screen.getAllByText('영남권').length).toBeGreaterThan(0)
        expect(screen.getAllByText('제주권').length).toBeGreaterThan(0)
      })
    })

    it('각 도시의 정보가 올바르게 표시되는지 - 예산', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        const budgetElements = screen.getAllByText(/중간|저렴/)
        expect(budgetElements.length).toBeGreaterThan(0)
        expect(screen.getAllByText('중간').length).toBeGreaterThan(0)
        expect(screen.getAllByText('저렴').length).toBeGreaterThan(0)
      })
    })

    it('도시 생성일이 올바른 형식으로 표시되는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        // Korean date format: YYYY. MM. DD.
        expect(screen.getAllByText('2024. 01. 01.').length).toBeGreaterThan(0)
        expect(screen.getAllByText('2024. 01. 02.').length).toBeGreaterThan(0)
        expect(screen.getAllByText('2024. 01. 03.').length).toBeGreaterThan(0)
      })
    })
  })

  describe('삭제 기능 테스트', () => {
    it('삭제 버튼이 렌더링되는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        const deleteButtons = screen.getAllByText(/삭제/)
        expect(deleteButtons.length).toBe(mockCities.length * 2) // Desktop + Mobile view
      })
    })

    it('삭제 버튼 클릭 시 confirm 다이얼로그 표시', async () => {
      const user = userEvent.setup()
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })
      ;(global.confirm as jest.Mock).mockReturnValue(false)

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })

      const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
      await user.click(deleteButtons[0])

      expect(global.confirm).toHaveBeenCalledWith('"서울"을(를) 정말 삭제하시겠습니까?')
    })

    it('confirm 취소 시 deleteCity() 호출되지 않음', async () => {
      const user = userEvent.setup()
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })
      ;(global.confirm as jest.Mock).mockReturnValue(false)

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })

      const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
      await user.click(deleteButtons[0])

      expect(deleteCity).not.toHaveBeenCalled()
    })

    it('confirm 확인 시 deleteCity() 호출', async () => {
      const user = userEvent.setup()
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })
      ;(global.confirm as jest.Mock).mockReturnValue(true)
      ;(deleteCity as jest.Mock).mockResolvedValue({ success: true })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })

      const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(deleteCity).toHaveBeenCalledWith('1')
      })
    })

    it('삭제 성공 시 목록 갱신', async () => {
      const user = userEvent.setup()
      const updatedCities = mockCities.slice(1) // Remove first city

      ;(getAllCitiesForAdmin as jest.Mock)
        .mockResolvedValueOnce({ success: true, data: mockCities })
        .mockResolvedValueOnce({ success: true, data: updatedCities })

      ;(global.confirm as jest.Mock).mockReturnValue(true)
      ;(deleteCity as jest.Mock).mockResolvedValue({ success: true })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })

      const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(getAllCitiesForAdmin).toHaveBeenCalledTimes(2)
      })
    })

    it('삭제 실패 시 에러 메시지 표시', async () => {
      const user = userEvent.setup()
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })
      ;(global.confirm as jest.Mock).mockReturnValue(true)
      ;(deleteCity as jest.Mock).mockResolvedValue({
        success: false,
        error: '삭제 권한이 없습니다',
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })

      const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('삭제 권한이 없습니다')
      })
    })

    it('삭제 중 예외 발생 시 에러 메시지 표시', async () => {
      const user = userEvent.setup()
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })
      ;(global.confirm as jest.Mock).mockReturnValue(true)
      ;(deleteCity as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })

      const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('도시 삭제 중 오류가 발생했습니다')
      })
    })
  })

  describe('에러 처리 테스트', () => {
    it('getAllCitiesForAdmin() 실패 시 에러 메시지 표시', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: false,
        error: '권한이 없습니다',
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getByText('권한이 없습니다')).toBeInTheDocument()
      })

      expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
    })

    it('getAllCitiesForAdmin() 실패 시 기본 에러 메시지 표시', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: false,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getByText('도시 목록을 불러오는데 실패했습니다')).toBeInTheDocument()
      })
    })

    it('getAllCitiesForAdmin() 예외 발생 시 에러 메시지 표시', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      ;(getAllCitiesForAdmin as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getByText('도시 목록을 불러오는 중 오류가 발생했습니다')).toBeInTheDocument()
      })

      expect(consoleError).toHaveBeenCalled()
      consoleError.mockRestore()
    })

    it('재시도 버튼이 표시되는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: false,
        error: '권한이 없습니다',
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getByText('다시 시도')).toBeInTheDocument()
      })
    })

    it('재시도 버튼 클릭 시 재로드', async () => {
      const user = userEvent.setup()
      ;(getAllCitiesForAdmin as jest.Mock)
        .mockResolvedValueOnce({ success: false, error: '권한이 없습니다' })
        .mockResolvedValueOnce({ success: true, data: mockCities })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getByText('다시 시도')).toBeInTheDocument()
      })

      const retryButton = screen.getByText('다시 시도')
      await user.click(retryButton)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })

      expect(getAllCitiesForAdmin).toHaveBeenCalledTimes(2)
    })
  })

  describe('엣지 케이스', () => {
    it('도시 목록이 비어있을 때', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: [],
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getByText('등록된 도시가 없습니다')).toBeInTheDocument()
      })
    })

    it('이미지 URL이 없을 때 대체 UI 표시', async () => {
      const cityWithoutImage: CityWithDetails[] = [
        {
          ...mockCities[0],
          image_url: '',
        },
      ]

      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: cityWithoutImage,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('No Image').length).toBeGreaterThan(0)
      })
    })

    it('삭제 중 버튼 비활성화 확인', async () => {
      const user = userEvent.setup()
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })
      ;(global.confirm as jest.Mock).mockReturnValue(true)
      ;(deleteCity as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000))
      )

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })

      const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
      await user.click(deleteButtons[0])

      await waitFor(() => {
        const deletingButtons = screen.getAllByText('삭제 중...')
        expect(deletingButtons.length).toBeGreaterThan(0)
        expect(deletingButtons[0]).toBeDisabled()
      })
    })

    it('null 값을 가진 도시 데이터 처리', async () => {
      const cityWithNulls: CityWithDetails[] = [
        {
          ...mockCities[0],
          badge: null,
        },
      ]

      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: cityWithNulls,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })
    })
  })

  describe('테이블/모바일 뷰 테스트', () => {
    it('데스크톱 테이블 뷰가 렌더링되는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      const { container } = render(<CityManagementList />)

      await waitFor(() => {
        const desktopTable = container.querySelector('.hidden.md\\:block')
        expect(desktopTable).toBeInTheDocument()
      })
    })

    it('모바일 카드 뷰가 렌더링되는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      const { container } = render(<CityManagementList />)

      await waitFor(() => {
        const mobileView = container.querySelector('.md\\:hidden')
        expect(mobileView).toBeInTheDocument()
      })
    })

    it('테이블 헤더가 올바르게 표시되는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getByText('이미지')).toBeInTheDocument()
        expect(screen.getByText('도시명')).toBeInTheDocument()
        expect(screen.getByText('국가/지역')).toBeInTheDocument()
        expect(screen.getByText('예산')).toBeInTheDocument()
        expect(screen.getByText('생성일')).toBeInTheDocument()
        expect(screen.getByText('액션')).toBeInTheDocument()
      })
    })
  })

  describe('이미지 렌더링 테스트', () => {
    it('이미지 URL이 있을 때 Image 컴포넌트 렌더링', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: [mockCities[0]],
      })

      render(<CityManagementList />)

      await waitFor(() => {
        const images = screen.getAllByAltText('서울')
        expect(images.length).toBeGreaterThan(0)
        expect(images[0]).toHaveAttribute('src', 'https://example.com/seoul.jpg')
      })
    })

    it('여러 도시의 이미지가 올바르게 표시되는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        const seoulImages = screen.getAllByAltText('서울')
        const busanImages = screen.getAllByAltText('부산')

        expect(seoulImages.length).toBeGreaterThan(0)
        expect(busanImages.length).toBeGreaterThan(0)
      })
    })
  })

  describe('통합 테스트', () => {
    it('전체 워크플로우: 로드 -> 삭제 -> 재로드', async () => {
      const user = userEvent.setup()
      const updatedCities = mockCities.slice(1)

      ;(getAllCitiesForAdmin as jest.Mock)
        .mockResolvedValueOnce({ success: true, data: mockCities })
        .mockResolvedValueOnce({ success: true, data: updatedCities })

      ;(global.confirm as jest.Mock).mockReturnValue(true)
      ;(deleteCity as jest.Mock).mockResolvedValue({ success: true })

      render(<CityManagementList />)

      // 초기 로드 확인
      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
        expect(screen.getAllByText('부산').length).toBeGreaterThan(0)
        expect(screen.getAllByText('제주').length).toBeGreaterThan(0)
      })

      // 삭제
      const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
      await user.click(deleteButtons[0])

      // 재로드 후 확인
      await waitFor(() => {
        expect(screen.queryByText('서울')).not.toBeInTheDocument()
        expect(screen.getAllByText('부산').length).toBeGreaterThan(0)
        expect(screen.getAllByText('제주').length).toBeGreaterThan(0)
      })
    })

    it('에러 상태에서 재시도 후 성공', async () => {
      const user = userEvent.setup()

      ;(getAllCitiesForAdmin as jest.Mock)
        .mockResolvedValueOnce({ success: false, error: '네트워크 오류' })
        .mockResolvedValueOnce({ success: true, data: mockCities })

      render(<CityManagementList />)

      // 에러 상태 확인
      await waitFor(() => {
        expect(screen.getByText('네트워크 오류')).toBeInTheDocument()
      })

      // 재시도
      const retryButton = screen.getByText('다시 시도')
      await user.click(retryButton)

      // 성공 확인
      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
        expect(screen.getAllByText('부산').length).toBeGreaterThan(0)
      })
    })

    it('여러 도시를 연속으로 삭제', async () => {
      const user = userEvent.setup()

      ;(getAllCitiesForAdmin as jest.Mock)
        .mockResolvedValueOnce({ success: true, data: mockCities })
        .mockResolvedValueOnce({ success: true, data: mockCities.slice(1) })
        .mockResolvedValueOnce({ success: true, data: mockCities.slice(2) })

      ;(global.confirm as jest.Mock).mockReturnValue(true)
      ;(deleteCity as jest.Mock).mockResolvedValue({ success: true })

      render(<CityManagementList />)

      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })

      // 첫 번째 삭제
      let deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.queryByText('서울')).not.toBeInTheDocument()
      })

      // 두 번째 삭제
      deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.queryByText('부산')).not.toBeInTheDocument()
      })

      expect(deleteCity).toHaveBeenCalledTimes(2)
    })
  })

  describe('날짜 포맷 테스트', () => {
    it('다양한 날짜 형식을 올바르게 포맷팅', async () => {
      const citiesWithDifferentDates: CityWithDetails[] = [
        { ...mockCities[0], created_at: '2023-12-15T00:00:00Z' },
        { ...mockCities[1], created_at: '2024-06-15T00:00:00Z' },
        { ...mockCities[2], created_at: '2024-11-01T00:00:00Z' },
      ]

      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: citiesWithDifferentDates,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        // Just check that dates are formatted and displayed
        expect(screen.getAllByText(/\d{4}\.\s\d{2}\.\s\d{2}\./).length).toBeGreaterThan(0)
      })
    })
  })

  describe('접근성 테스트', () => {
    it('삭제 버튼에 role이 올바르게 설정되어 있는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
        expect(deleteButtons.length).toBeGreaterThan(0)
      })
    })

    it('이미지에 alt 텍스트가 설정되어 있는지', async () => {
      ;(getAllCitiesForAdmin as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCities,
      })

      render(<CityManagementList />)

      // First wait for data to load
      await waitFor(() => {
        expect(screen.getAllByText('서울').length).toBeGreaterThan(0)
      })

      // Then check for alt text (only for cities with images)
      const seoulImages = screen.getAllByAltText('서울')
      const busanImages = screen.getAllByAltText('부산')

      expect(seoulImages.length).toBeGreaterThan(0)
      expect(busanImages.length).toBeGreaterThan(0)

      // 제주 has empty image_url, so it should show "No Image" instead
      expect(screen.getAllByText('No Image').length).toBeGreaterThan(0)
    })
  })
})
