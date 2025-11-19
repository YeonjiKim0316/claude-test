import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboard from '../admin-dashboard';
import { getAllCitiesForAdmin } from '@/app/actions/admin';
import type { CityWithDetails } from '../city-management-list';

// Mock the admin actions
jest.mock('@/app/actions/admin', () => ({
  getAllCitiesForAdmin: jest.fn(),
}));

// Mock the child components
jest.mock('../add-city-form', () => ({
  __esModule: true,
  default: ({ onSuccess }: any) => (
    <div data-testid="add-city-form">
      <button onClick={() => onSuccess && onSuccess()}>Mock Add City</button>
    </div>
  ),
}));

jest.mock('../city-management-list', () => ({
  __esModule: true,
  default: ({ cities, isLoading, onCitiesChange }: any) => (
    <div data-testid="city-management-list">
      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <>
          <div data-testid="city-count">{cities.length}</div>
          <button onClick={() => onCitiesChange && onCitiesChange()}>
            Mock Cities Change
          </button>
          {cities.map((city: any) => (
            <div key={city.id} data-testid={`city-${city.id}`}>
              {city.name_ko}
            </div>
          ))}
        </>
      )}
    </div>
  ),
}));

// Mock city data
const mockKoreanCity: CityWithDetails = {
  id: '1',
  name_ko: '서울',
  name_en: 'Seoul',
  slug: 'seoul',
  country: 'South Korea',
  region: 'Asia',
  korean_region: '수도권',
  budget: '고',
  environment: ['도시'],
  best_season: '봄/가을',
  cost_per_month: 2000000,
};

const mockKoreanCity2: CityWithDetails = {
  id: '2',
  name_ko: '부산',
  name_en: 'Busan',
  slug: 'busan',
  country: '대한민국',
  region: 'Asia',
  korean_region: '남부',
  budget: '중',
  environment: ['해변', '도시'],
  best_season: '여름',
  cost_per_month: 1500000,
};

const mockForeignCity: CityWithDetails = {
  id: '3',
  name_ko: '방콕',
  name_en: 'Bangkok',
  slug: 'bangkok',
  country: 'Thailand',
  region: 'Southeast Asia',
  budget: '저',
  environment: ['도시', '열대'],
  best_season: '11월-2월',
  cost_per_month: 1000000,
};

const mockForeignCity2: CityWithDetails = {
  id: '4',
  name_ko: '리스본',
  name_en: 'Lisbon',
  slug: 'lisbon',
  country: 'Portugal',
  region: 'Europe',
  budget: '중',
  environment: ['도시', '해변'],
  best_season: '봄/가을',
  cost_per_month: 1800000,
};

describe('AdminDashboard', () => {
  const mockGetAllCitiesForAdmin = getAllCitiesForAdmin as jest.MockedFunction<
    typeof getAllCitiesForAdmin
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. 렌더링 테스트', () => {
    it('컴포넌트가 정상적으로 렌더링되는지', async () => {
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText('새 도시 추가')).toBeInTheDocument();
        expect(screen.getByText('도시 목록 관리')).toBeInTheDocument();
      });
    });

    it('3개의 탭이 표시되는지 (전체, 대한민국, 해외)', async () => {
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '전체' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '대한민국' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '해외' })).toBeInTheDocument();
      });
    });

    it('AddCityForm과 CityManagementList가 렌더링되는지', async () => {
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('add-city-form')).toBeInTheDocument();
        expect(screen.getByTestId('city-management-list')).toBeInTheDocument();
      });
    });
  });

  describe('2. 데이터 로드 테스트', () => {
    it('getAllCitiesForAdmin() 호출 확인', async () => {
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(mockGetAllCitiesForAdmin).toHaveBeenCalledTimes(1);
      });
    });

    it('로딩 상태 표시 확인', async () => {
      mockGetAllCitiesForAdmin.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true, data: [mockKoreanCity] }), 100)
          )
      );

      render(<AdminDashboard />);

      expect(screen.getByText('로딩 중...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText('로딩 중...')).not.toBeInTheDocument();
      });
    });

    it('성공 시 도시 목록 표시', async () => {
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockForeignCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('city-1')).toHaveTextContent('서울');
        expect(screen.getByTestId('city-3')).toHaveTextContent('방콕');
      });
    });
  });

  describe('3. 탭 필터링 테스트', () => {
    it('전체 탭: 모든 도시 표시', async () => {
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockKoreanCity2, mockForeignCity, mockForeignCity2],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        const cityCount = screen.getByTestId('city-count');
        expect(cityCount).toHaveTextContent('4');
      });
    });

    it('대한민국 탭: 한국 도시만 표시', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockKoreanCity2, mockForeignCity, mockForeignCity2],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('city-count')).toHaveTextContent('4');
      });

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);

      await waitFor(() => {
        const cityCount = screen.getByTestId('city-count');
        expect(cityCount).toHaveTextContent('2');
        expect(screen.getByTestId('city-1')).toBeInTheDocument(); // 서울
        expect(screen.getByTestId('city-2')).toBeInTheDocument(); // 부산
        expect(screen.queryByTestId('city-3')).not.toBeInTheDocument(); // 방콕 제외
        expect(screen.queryByTestId('city-4')).not.toBeInTheDocument(); // 리스본 제외
      });
    });

    it('해외 탭: 해외 도시만 표시', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockKoreanCity2, mockForeignCity, mockForeignCity2],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('city-count')).toHaveTextContent('4');
      });

      const foreignTab = screen.getByRole('button', { name: '해외' });
      await user.click(foreignTab);

      await waitFor(() => {
        const cityCount = screen.getByTestId('city-count');
        expect(cityCount).toHaveTextContent('2');
        expect(screen.getByTestId('city-3')).toBeInTheDocument(); // 방콕
        expect(screen.getByTestId('city-4')).toBeInTheDocument(); // 리스본
        expect(screen.queryByTestId('city-1')).not.toBeInTheDocument(); // 서울 제외
        expect(screen.queryByTestId('city-2')).not.toBeInTheDocument(); // 부산 제외
      });
    });

    it('탭 전환 시 CityManagementList에 필터링된 데이터 전달', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockForeignCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('city-count')).toHaveTextContent('2');
      });

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);

      await waitFor(() => {
        expect(screen.getByTestId('city-count')).toHaveTextContent('1');
      });

      const foreignTab = screen.getByRole('button', { name: '해외' });
      await user.click(foreignTab);

      await waitFor(() => {
        expect(screen.getByTestId('city-count')).toHaveTextContent('1');
      });
    });
  });

  describe('4. 탭 상태 관리 테스트', () => {
    it('기본 선택 탭: "전체"', async () => {
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        const allTab = screen.getByRole('button', { name: '전체' });
        expect(allTab).toHaveClass('bg-purple-500/20');
        expect(allTab).toHaveClass('border-purple-500/40');
        expect(allTab).toHaveClass('text-purple-400');
      });
    });

    it('탭 클릭 시 활성 탭 변경', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockForeignCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('city-count')).toHaveTextContent('2');
      });

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);

      await waitFor(() => {
        expect(koreaTab).toHaveClass('bg-purple-500/20');
        expect(koreaTab).toHaveClass('text-purple-400');
      });
    });

    it('활성 탭 스타일 적용 확인', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        const allTab = screen.getByRole('button', { name: '전체' });
        expect(allTab).toHaveClass('bg-purple-500/20');
      });

      const foreignTab = screen.getByRole('button', { name: '해외' });
      expect(foreignTab).toHaveClass('bg-slate-700/30');
      expect(foreignTab).toHaveClass('text-gray-400');

      await user.click(foreignTab);

      await waitFor(() => {
        expect(foreignTab).toHaveClass('bg-purple-500/20');
        expect(foreignTab).toHaveClass('text-purple-400');
      });
    });
  });

  describe('5. 도시 카운트 표시 테스트', () => {
    it('필터링된 도시 수 표시', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockKoreanCity2, mockForeignCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/총 3개의 도시/)).toBeInTheDocument();
      });

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);

      await waitFor(() => {
        expect(screen.getByText(/총 2개의 도시/)).toBeInTheDocument();
      });
    });

    it('전체 도시 수 표시', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockKoreanCity2, mockForeignCity, mockForeignCity2],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/총 4개의 도시/)).toBeInTheDocument();
      });

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);

      await waitFor(() => {
        expect(screen.getByText(/총 2개의 도시/)).toBeInTheDocument();
        expect(screen.getByText(/\(전체: 4\)/)).toBeInTheDocument();
      });

      const foreignTab = screen.getByRole('button', { name: '해외' });
      await user.click(foreignTab);

      await waitFor(() => {
        expect(screen.getByText(/총 2개의 도시/)).toBeInTheDocument();
        expect(screen.getByText(/\(전체: 4\)/)).toBeInTheDocument();
      });
    });
  });

  describe('6. 에러 처리 테스트', () => {
    it('getAllCitiesForAdmin() 실패 시 에러 메시지 표시', async () => {
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: false,
        error: '서버 오류가 발생했습니다.',
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText('서버 오류가 발생했습니다.')).toBeInTheDocument();
      });
    });

    it('getAllCitiesForAdmin() 예외 발생 시 기본 에러 메시지 표시', async () => {
      mockGetAllCitiesForAdmin.mockRejectedValueOnce(new Error('Network error'));

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText('도시 목록을 불러오는데 실패했습니다.')).toBeInTheDocument();
      });
    });

    it('에러 발생 시 컴포넌트 정상 렌더링 중단', async () => {
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: false,
        error: '에러 발생',
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText('에러 발생')).toBeInTheDocument();
        expect(screen.queryByTestId('add-city-form')).not.toBeInTheDocument();
        expect(screen.queryByTestId('city-management-list')).not.toBeInTheDocument();
      });
    });
  });

  describe('7. 콜백 테스트', () => {
    it('AddCityForm의 onSuccess 콜백 시 목록 갱신', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin
        .mockResolvedValueOnce({
          success: true,
          data: [mockKoreanCity],
        })
        .mockResolvedValueOnce({
          success: true,
          data: [mockKoreanCity, mockForeignCity],
        });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('city-count')).toHaveTextContent('1');
      });

      const addButton = screen.getByText('Mock Add City');
      await user.click(addButton);

      await waitFor(() => {
        expect(mockGetAllCitiesForAdmin).toHaveBeenCalledTimes(2);
        expect(screen.getByTestId('city-count')).toHaveTextContent('2');
      });
    });

    it('CityManagementList의 onCitiesChange 콜백 시 목록 갱신', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin
        .mockResolvedValueOnce({
          success: true,
          data: [mockKoreanCity, mockForeignCity],
        })
        .mockResolvedValueOnce({
          success: true,
          data: [mockKoreanCity],
        });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('city-count')).toHaveTextContent('2');
      });

      const changeButton = screen.getByText('Mock Cities Change');
      await user.click(changeButton);

      await waitFor(() => {
        expect(mockGetAllCitiesForAdmin).toHaveBeenCalledTimes(2);
        expect(screen.getByTestId('city-count')).toHaveTextContent('1');
      });
    });
  });

  describe('8. 엣지 케이스', () => {
    it('도시 목록이 비어있을 때', async () => {
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/총 0개의 도시/)).toBeInTheDocument();
        expect(screen.getByTestId('city-count')).toHaveTextContent('0');
      });
    });

    it('한국 도시만 있을 때', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockKoreanCity2],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/총 2개의 도시/)).toBeInTheDocument();
      });

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);

      await waitFor(() => {
        expect(screen.getByText(/총 2개의 도시/)).toBeInTheDocument();
      });

      const foreignTab = screen.getByRole('button', { name: '해외' });
      await user.click(foreignTab);

      await waitFor(() => {
        expect(screen.getByText(/총 0개의 도시/)).toBeInTheDocument();
        expect(screen.getByTestId('city-count')).toHaveTextContent('0');
      });
    });

    it('해외 도시만 있을 때', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockForeignCity, mockForeignCity2],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/총 2개의 도시/)).toBeInTheDocument();
      });

      const foreignTab = screen.getByRole('button', { name: '해외' });
      await user.click(foreignTab);

      await waitFor(() => {
        expect(screen.getByText(/총 2개의 도시/)).toBeInTheDocument();
      });

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);

      await waitFor(() => {
        expect(screen.getByText(/총 0개의 도시/)).toBeInTheDocument();
        expect(screen.getByTestId('city-count')).toHaveTextContent('0');
      });
    });

    it('한국 도시 판별: country가 "South Korea"인 경우', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockForeignCity],
      });

      render(<AdminDashboard />);

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);

      await waitFor(() => {
        expect(screen.getByTestId('city-1')).toBeInTheDocument();
        expect(screen.queryByTestId('city-3')).not.toBeInTheDocument();
      });
    });

    it('한국 도시 판별: country가 "대한민국"인 경우', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity2, mockForeignCity],
      });

      render(<AdminDashboard />);

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);

      await waitFor(() => {
        expect(screen.getByTestId('city-2')).toBeInTheDocument();
        expect(screen.queryByTestId('city-3')).not.toBeInTheDocument();
      });
    });

    it('한국 도시 판별: korean_region이 있는 경우', async () => {
      const user = userEvent.setup();
      const cityWithKoreanRegion: CityWithDetails = {
        ...mockForeignCity,
        id: '5',
        korean_region: '제주',
      };

      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [cityWithKoreanRegion, mockForeignCity2],
      });

      render(<AdminDashboard />);

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);

      await waitFor(() => {
        expect(screen.getByTestId('city-5')).toBeInTheDocument();
        expect(screen.queryByTestId('city-4')).not.toBeInTheDocument();
      });
    });
  });

  describe('9. 탭 전환 통합 테스트', () => {
    it('전체 -> 대한민국 -> 해외 -> 전체 순서로 탭 전환', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockKoreanCity2, mockForeignCity, mockForeignCity2],
      });

      render(<AdminDashboard />);

      // 전체 탭 (기본)
      await waitFor(() => {
        expect(screen.getByText(/총 4개의 도시/)).toBeInTheDocument();
      });

      // 대한민국 탭
      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      await user.click(koreaTab);
      await waitFor(() => {
        expect(screen.getByText(/총 2개의 도시/)).toBeInTheDocument();
        expect(screen.getByText(/\(전체: 4\)/)).toBeInTheDocument();
      });

      // 해외 탭
      const foreignTab = screen.getByRole('button', { name: '해외' });
      await user.click(foreignTab);
      await waitFor(() => {
        expect(screen.getByText(/총 2개의 도시/)).toBeInTheDocument();
        expect(screen.getByText(/\(전체: 4\)/)).toBeInTheDocument();
      });

      // 전체 탭으로 다시
      const allTab = screen.getByRole('button', { name: '전체' });
      await user.click(allTab);
      await waitFor(() => {
        const text = screen.getByText(/총 4개의 도시/);
        expect(text).toBeInTheDocument();
        expect(screen.queryByText(/\(전체:/)).not.toBeInTheDocument();
      });
    });

    it('여러 탭을 빠르게 전환해도 정상 동작', async () => {
      const user = userEvent.setup();
      mockGetAllCitiesForAdmin.mockResolvedValueOnce({
        success: true,
        data: [mockKoreanCity, mockForeignCity],
      });

      render(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('city-count')).toHaveTextContent('2');
      });

      const koreaTab = screen.getByRole('button', { name: '대한민국' });
      const foreignTab = screen.getByRole('button', { name: '해외' });
      const allTab = screen.getByRole('button', { name: '전체' });

      await user.click(koreaTab);
      await user.click(foreignTab);
      await user.click(allTab);
      await user.click(koreaTab);

      await waitFor(() => {
        expect(screen.getByTestId('city-count')).toHaveTextContent('1');
        expect(koreaTab).toHaveClass('bg-purple-500/20');
      });
    });
  });
});
