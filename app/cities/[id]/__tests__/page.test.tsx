import { render, screen, waitFor } from '@testing-library/react'
import { notFound } from 'next/navigation'
import CityDetailPage from '../page'
import { mockCityDetails } from '@/lib/mock-data'

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

// Mock all city components
jest.mock('@/components/city-hero', () => ({
  __esModule: true,
  default: ({ city }: any) => <div data-testid="city-hero">{city.name_ko}</div>,
}))

jest.mock('@/components/city-stats', () => ({
  __esModule: true,
  default: ({ city }: any) => <div data-testid="city-stats">{city.name_ko} Stats</div>,
}))

jest.mock('@/components/city-description', () => ({
  __esModule: true,
  default: ({ city }: any) => <div data-testid="city-description">{city.description}</div>,
}))

jest.mock('@/components/city-cost-breakdown', () => ({
  __esModule: true,
  default: ({ city }: any) => <div data-testid="city-cost-breakdown">{city.name_ko} Cost</div>,
}))

jest.mock('@/components/city-gallery', () => ({
  __esModule: true,
  default: ({ city }: any) => <div data-testid="city-gallery">{city.name_ko} Gallery</div>,
}))

describe('CityDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Page rendering with valid city slug', () => {
    it('should render the page with valid city slug (jeju)', async () => {
      const params = Promise.resolve({ id: 'jeju' })
      const page = await CityDetailPage({ params })

      render(page)

      // Check if the page renders
      expect(screen.getByTestId('city-hero')).toBeInTheDocument()
      expect(screen.getByText('제주')).toBeInTheDocument()
    })

    it('should render the page with valid city slug (busan)', async () => {
      const params = Promise.resolve({ id: 'busan' })
      const page = await CityDetailPage({ params })

      render(page)

      expect(screen.getByTestId('city-hero')).toBeInTheDocument()
      expect(screen.getByText('부산')).toBeInTheDocument()
    })

    it('should render the page with valid city slug (seoul-gangnam)', async () => {
      const params = Promise.resolve({ id: 'seoul-gangnam' })
      const page = await CityDetailPage({ params })

      render(page)

      expect(screen.getByTestId('city-hero')).toBeInTheDocument()
      expect(screen.getByText('서울 강남')).toBeInTheDocument()
    })
  })

  describe('Component rendering order', () => {
    it('should render all 5 components in correct order', async () => {
      const params = Promise.resolve({ id: 'jeju' })
      const page = await CityDetailPage({ params })

      const { container } = render(page)

      // Verify all components are present
      const hero = screen.getByTestId('city-hero')
      const stats = screen.getByTestId('city-stats')
      const description = screen.getByTestId('city-description')
      const costBreakdown = screen.getByTestId('city-cost-breakdown')
      const gallery = screen.getByTestId('city-gallery')

      expect(hero).toBeInTheDocument()
      expect(stats).toBeInTheDocument()
      expect(description).toBeInTheDocument()
      expect(costBreakdown).toBeInTheDocument()
      expect(gallery).toBeInTheDocument()

      // Verify rendering order by checking DOM position
      const allComponents = container.querySelectorAll('[data-testid^="city-"]')
      expect(allComponents[0]).toHaveAttribute('data-testid', 'city-hero')
      expect(allComponents[1]).toHaveAttribute('data-testid', 'city-stats')
      expect(allComponents[2]).toHaveAttribute('data-testid', 'city-description')
      expect(allComponents[3]).toHaveAttribute('data-testid', 'city-cost-breakdown')
      expect(allComponents[4]).toHaveAttribute('data-testid', 'city-gallery')
    })

    it('should pass correct city data to each component', async () => {
      const params = Promise.resolve({ id: 'busan' })
      const page = await CityDetailPage({ params })

      render(page)

      // Verify each component receives the correct city data
      expect(screen.getByTestId('city-hero')).toHaveTextContent('부산')
      expect(screen.getByTestId('city-stats')).toHaveTextContent('부산 Stats')
      expect(screen.getByTestId('city-cost-breakdown')).toHaveTextContent('부산 Cost')
      expect(screen.getByTestId('city-gallery')).toHaveTextContent('부산 Gallery')

      const busanCity = mockCityDetails.find(c => c.slug === 'busan')
      expect(screen.getByTestId('city-description')).toHaveTextContent(busanCity!.description)
    })
  })

  describe('Back button', () => {
    it('should render back button with correct text', async () => {
      const params = Promise.resolve({ id: 'jeju' })
      const page = await CityDetailPage({ params })

      render(page)

      const backButton = screen.getByRole('link', { name: /메인으로 돌아가기/i })
      expect(backButton).toBeInTheDocument()
    })

    it('should have correct href to home page', async () => {
      const params = Promise.resolve({ id: 'jeju' })
      const page = await CityDetailPage({ params })

      render(page)

      const backButton = screen.getByRole('link', { name: /메인으로 돌아가기/i })
      expect(backButton).toHaveAttribute('href', '/')
    })

    it('should have ArrowLeft icon in back button', async () => {
      const params = Promise.resolve({ id: 'jeju' })
      const page = await CityDetailPage({ params })

      const { container } = render(page)

      const backButton = screen.getByRole('link', { name: /메인으로 돌아가기/i })
      expect(backButton).toBeInTheDocument()

      // Check for the presence of svg element (ArrowLeft icon)
      const svg = backButton.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('City data fetching', () => {
    it('should correctly fetch city data from mockCityDetails by slug', async () => {
      const params = Promise.resolve({ id: 'jeju' })
      const page = await CityDetailPage({ params })

      render(page)

      const jejuCity = mockCityDetails.find(c => c.slug === 'jeju')

      // Verify data is correctly fetched and passed
      expect(screen.getByTestId('city-hero')).toHaveTextContent(jejuCity!.name_ko)
      expect(screen.getByTestId('city-description')).toHaveTextContent(jejuCity!.description)
    })

    it('should fetch different cities correctly', async () => {
      const cities = ['jeju', 'busan', 'seoul-gangnam', 'gangneung']

      for (const citySlug of cities) {
        const params = Promise.resolve({ id: citySlug })
        const page = await CityDetailPage({ params })

        const { unmount } = render(page)

        const cityData = mockCityDetails.find(c => c.slug === citySlug)
        expect(screen.getByTestId('city-hero')).toHaveTextContent(cityData!.name_ko)

        unmount()
      }
    })

    it('should handle all cities in mockCityDetails', async () => {
      for (const city of mockCityDetails) {
        const params = Promise.resolve({ id: city.slug })
        const page = await CityDetailPage({ params })

        const { unmount } = render(page)

        expect(screen.getByTestId('city-hero')).toHaveTextContent(city.name_ko)
        expect(screen.getByTestId('city-description')).toHaveTextContent(city.description)

        unmount()
      }
    })
  })

  describe('Not found handling', () => {
    it('should call notFound() when city slug does not exist', async () => {
      const params = Promise.resolve({ id: 'non-existent-city' })

      await CityDetailPage({ params })

      expect(notFound).toHaveBeenCalled()
      expect(notFound).toHaveBeenCalledTimes(1)
    })

    it('should call notFound() for invalid slugs', async () => {
      const invalidSlugs = ['', 'invalid', 'test-city', '123', 'seoul-invalid']

      for (const slug of invalidSlugs) {
        jest.clearAllMocks()
        const params = Promise.resolve({ id: slug })

        await CityDetailPage({ params })

        expect(notFound).toHaveBeenCalled()
      }
    })

    it('should not call notFound() for valid slugs', async () => {
      const validSlugs = ['jeju', 'busan', 'seoul-gangnam']

      for (const slug of validSlugs) {
        jest.clearAllMocks()
        const params = Promise.resolve({ id: slug })
        const page = await CityDetailPage({ params })

        render(page)

        expect(notFound).not.toHaveBeenCalled()
      }
    })
  })

  describe('Async params handling', () => {
    it('should properly await params before accessing id', async () => {
      const params = Promise.resolve({ id: 'jeju' })

      // This should not throw
      await expect(CityDetailPage({ params })).resolves.toBeDefined()
    })

    it('should handle params as a Promise', async () => {
      const params = new Promise<{ id: string }>((resolve) => {
        setTimeout(() => resolve({ id: 'busan' }), 10)
      })

      const page = await CityDetailPage({ params })
      render(page)

      expect(screen.getByTestId('city-hero')).toHaveTextContent('부산')
    })

    it('should correctly extract id from awaited params', async () => {
      const testId = 'seoul-gangnam'
      const params = Promise.resolve({ id: testId })
      const page = await CityDetailPage({ params })

      render(page)

      const cityData = mockCityDetails.find(c => c.slug === testId)
      expect(screen.getByTestId('city-hero')).toHaveTextContent(cityData!.name_ko)
    })
  })

  describe('Page styling and classes', () => {
    it('should have correct container classes', async () => {
      const params = Promise.resolve({ id: 'jeju' })
      const page = await CityDetailPage({ params })

      const { container } = render(page)

      const mainContainer = container.querySelector('.min-h-screen')
      expect(mainContainer).toBeInTheDocument()
      expect(mainContainer).toHaveClass('bg-gradient-to-br')
      expect(mainContainer).toHaveClass('from-slate-900')
      expect(mainContainer).toHaveClass('via-purple-900')
      expect(mainContainer).toHaveClass('to-slate-900')
    })

    it('should have correct content wrapper classes', async () => {
      const params = Promise.resolve({ id: 'jeju' })
      const page = await CityDetailPage({ params })

      const { container } = render(page)

      const contentWrapper = container.querySelector('.max-w-7xl')
      expect(contentWrapper).toBeInTheDocument()
      expect(contentWrapper).toHaveClass('mx-auto')
      expect(contentWrapper).toHaveClass('py-12')
      expect(contentWrapper).toHaveClass('space-y-12')
    })

    it('should have gradient button styling on back button', async () => {
      const params = Promise.resolve({ id: 'jeju' })
      const page = await CityDetailPage({ params })

      render(page)

      const backButton = screen.getByRole('link', { name: /메인으로 돌아가기/i })
      expect(backButton).toHaveClass('bg-gradient-to-r')
      expect(backButton).toHaveClass('from-purple-500')
      expect(backButton).toHaveClass('to-pink-500')
    })
  })

  describe('Integration tests', () => {
    it('should render complete page structure for jeju', async () => {
      const params = Promise.resolve({ id: 'jeju' })
      const page = await CityDetailPage({ params })

      const { container } = render(page)

      // Check main structure
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument()

      // Check all components
      expect(screen.getByTestId('city-hero')).toBeInTheDocument()
      expect(screen.getByTestId('city-stats')).toBeInTheDocument()
      expect(screen.getByTestId('city-description')).toBeInTheDocument()
      expect(screen.getByTestId('city-cost-breakdown')).toBeInTheDocument()
      expect(screen.getByTestId('city-gallery')).toBeInTheDocument()

      // Check back button
      expect(screen.getByRole('link', { name: /메인으로 돌아가기/i })).toBeInTheDocument()
    })

    it('should render complete page with all data for multiple cities', async () => {
      const testCities = ['jeju', 'busan', 'seoul-gangnam']

      for (const citySlug of testCities) {
        const params = Promise.resolve({ id: citySlug })
        const page = await CityDetailPage({ params })

        const { unmount } = render(page)

        const cityData = mockCityDetails.find(c => c.slug === citySlug)

        // Verify complete rendering
        expect(screen.getByTestId('city-hero')).toHaveTextContent(cityData!.name_ko)
        expect(screen.getByTestId('city-stats')).toBeInTheDocument()
        expect(screen.getByTestId('city-description')).toHaveTextContent(cityData!.description)
        expect(screen.getByTestId('city-cost-breakdown')).toBeInTheDocument()
        expect(screen.getByTestId('city-gallery')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /메인으로 돌아가기/i })).toHaveAttribute('href', '/')

        unmount()
      }
    })
  })

  describe('Edge cases', () => {
    it('should handle case-sensitive slug matching', async () => {
      const params = Promise.resolve({ id: 'Jeju' })

      await CityDetailPage({ params })

      // Should call notFound because 'Jeju' !== 'jeju'
      expect(notFound).toHaveBeenCalled()
    })

    it('should handle slug with extra spaces', async () => {
      const params = Promise.resolve({ id: ' jeju ' })

      await CityDetailPage({ params })

      // Should call notFound because ' jeju ' !== 'jeju'
      expect(notFound).toHaveBeenCalled()
    })

    it('should handle slug with special characters', async () => {
      const params = Promise.resolve({ id: 'jeju#test' })

      await CityDetailPage({ params })

      expect(notFound).toHaveBeenCalled()
    })
  })
})
