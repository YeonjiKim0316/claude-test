import { render, screen } from '@testing-library/react'
import Loading from '../loading'

describe('Loading Component', () => {
  describe('Skeleton rendering', () => {
    it('should render without crashing', () => {
      render(<Loading />)

      // Check for main container
      const container = screen.getByRole('main', { hidden: true }) || document.querySelector('.min-h-screen')
      expect(container).toBeInTheDocument()
    })

    it('should have the correct background gradient classes', () => {
      const { container } = render(<Loading />)

      const mainContainer = container.querySelector('.min-h-screen')
      expect(mainContainer).toHaveClass('bg-gradient-to-br')
      expect(mainContainer).toHaveClass('from-slate-900')
      expect(mainContainer).toHaveClass('via-purple-900')
      expect(mainContainer).toHaveClass('to-slate-900')
    })
  })

  describe('Hero skeleton section', () => {
    it('should render hero skeleton section', () => {
      const { container } = render(<Loading />)

      const heroSkeleton = container.querySelector('.relative.h-\\[500px\\]')
      expect(heroSkeleton).toBeInTheDocument()
    })

    it('should have animate-pulse class on hero skeleton', () => {
      const { container } = render(<Loading />)

      const heroSkeleton = container.querySelector('.relative.h-\\[500px\\]')
      expect(heroSkeleton).toHaveClass('animate-pulse')
      expect(heroSkeleton).toHaveClass('bg-slate-800')
    })

    it('should render hero skeleton placeholder elements', () => {
      const { container } = render(<Loading />)

      // Check for title placeholder
      const titlePlaceholder = container.querySelector('.h-12.w-64.bg-slate-700')
      expect(titlePlaceholder).toBeInTheDocument()

      // Check for subtitle placeholder
      const subtitlePlaceholder = container.querySelector('.h-6.w-48.bg-slate-700')
      expect(subtitlePlaceholder).toBeInTheDocument()

      // Check for description placeholder
      const descPlaceholder = container.querySelector('.h-20')
      expect(descPlaceholder).toBeInTheDocument()
    })
  })

  describe('Stats grid skeleton section', () => {
    it('should render stats grid skeleton', () => {
      const { container } = render(<Loading />)

      const statsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-5')
      expect(statsGrid).toBeInTheDocument()
    })

    it('should render exactly 5 skeleton stat items', () => {
      const { container } = render(<Loading />)

      const statsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-5')
      const statItems = statsGrid?.querySelectorAll('.bg-slate-800\\/50.backdrop-blur-sm.rounded-xl.p-6.animate-pulse')

      expect(statItems).toHaveLength(5)
    })

    it('should have correct structure for each stat skeleton item', () => {
      const { container } = render(<Loading />)

      const statsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-5')
      const firstStatItem = statsGrid?.querySelector('.bg-slate-800\\/50.backdrop-blur-sm.rounded-xl.p-6.animate-pulse')

      // Icon placeholder
      const iconPlaceholder = firstStatItem?.querySelector('.h-10.w-10.bg-slate-700.rounded-full')
      expect(iconPlaceholder).toBeInTheDocument()

      // Label placeholder
      const labelPlaceholder = firstStatItem?.querySelector('.h-4.w-20.bg-slate-700')
      expect(labelPlaceholder).toBeInTheDocument()

      // Value placeholder
      const valuePlaceholder = firstStatItem?.querySelector('.h-8.w-24.bg-slate-700')
      expect(valuePlaceholder).toBeInTheDocument()
    })
  })

  describe('Description skeleton section', () => {
    it('should render description skeleton section', () => {
      const { container } = render(<Loading />)

      // Find the description skeleton by its unique structure
      const descriptionSection = Array.from(
        container.querySelectorAll('.bg-slate-800\\/50.backdrop-blur-sm.rounded-2xl.p-8.animate-pulse')
      ).find(el => {
        // Description section has 4 skeleton lines
        const lines = el.querySelectorAll('.h-4.w-full.bg-slate-700, .h-4.w-3\\/4.bg-slate-700')
        return lines.length >= 3
      })

      expect(descriptionSection).toBeInTheDocument()
    })

    it('should have title and description line skeletons', () => {
      const { container } = render(<Loading />)

      const descriptionSection = Array.from(
        container.querySelectorAll('.bg-slate-800\\/50.backdrop-blur-sm.rounded-2xl.p-8.animate-pulse')
      ).find(el => {
        const lines = el.querySelectorAll('.h-4.w-full.bg-slate-700, .h-4.w-3\\/4.bg-slate-700')
        return lines.length >= 3
      })

      // Title skeleton
      const title = descriptionSection?.querySelector('.h-8.w-48.bg-slate-700')
      expect(title).toBeInTheDocument()

      // Text line skeletons
      const fullWidthLines = descriptionSection?.querySelectorAll('.h-4.w-full.bg-slate-700')
      expect(fullWidthLines!.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Cost breakdown skeleton section', () => {
    it('should render cost breakdown skeleton section', () => {
      const { container } = render(<Loading />)

      const costSection = Array.from(
        container.querySelectorAll('.bg-slate-800\\/50.backdrop-blur-sm.rounded-2xl.p-8.animate-pulse')
      ).find(el => {
        // Cost section has a grid with 2 columns
        return el.querySelector('.grid.grid-cols-1.md\\:grid-cols-2') !== null
      })

      expect(costSection).toBeInTheDocument()
    })

    it('should render exactly 4 cost item skeletons', () => {
      const { container } = render(<Loading />)

      const costSection = Array.from(
        container.querySelectorAll('.bg-slate-800\\/50.backdrop-blur-sm.rounded-2xl.p-8.animate-pulse')
      ).find(el => {
        return el.querySelector('.grid.grid-cols-1.md\\:grid-cols-2') !== null
      })

      const costGrid = costSection?.querySelector('.grid.grid-cols-1.md\\:grid-cols-2')
      const costItems = costGrid?.querySelectorAll('.flex.items-center.justify-between')

      expect(costItems).toHaveLength(4)
    })

    it('should have correct structure for each cost item skeleton', () => {
      const { container } = render(<Loading />)

      const costSection = Array.from(
        container.querySelectorAll('.bg-slate-800\\/50.backdrop-blur-sm.rounded-2xl.p-8.animate-pulse')
      ).find(el => {
        return el.querySelector('.grid.grid-cols-1.md\\:grid-cols-2') !== null
      })

      const costGrid = costSection?.querySelector('.grid.grid-cols-1.md\\:grid-cols-2')
      const firstCostItem = costGrid?.querySelector('.flex.items-center.justify-between')

      // Label skeleton
      const labelSkeleton = firstCostItem?.querySelector('.h-6.w-32.bg-slate-700')
      expect(labelSkeleton).toBeInTheDocument()

      // Value skeleton
      const valueSkeleton = firstCostItem?.querySelector('.h-6.w-24.bg-slate-700')
      expect(valueSkeleton).toBeInTheDocument()
    })
  })

  describe('Gallery skeleton section', () => {
    it('should render gallery skeleton section', () => {
      const { container } = render(<Loading />)

      const galleryGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6')
      expect(galleryGrid).toBeInTheDocument()
    })

    it('should render gallery title skeleton', () => {
      const { container } = render(<Loading />)

      // Find the gallery section by looking for the gallery grid
      const galleryContainer = container.querySelector('.space-y-6')
      const titleSkeleton = galleryContainer?.querySelector('.h-8.w-48.bg-slate-700.animate-pulse')

      expect(titleSkeleton).toBeInTheDocument()
    })

    it('should render exactly 4 gallery image skeletons', () => {
      const { container } = render(<Loading />)

      const galleryGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6')
      const galleryItems = galleryGrid?.querySelectorAll('.aspect-video.bg-slate-800.rounded-xl.animate-pulse')

      expect(galleryItems).toHaveLength(4)
    })

    it('should have aspect-video class on gallery items', () => {
      const { container } = render(<Loading />)

      const galleryGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6')
      const galleryItems = galleryGrid?.querySelectorAll('.aspect-video')

      galleryItems?.forEach(item => {
        expect(item).toHaveClass('aspect-video')
        expect(item).toHaveClass('bg-slate-800')
        expect(item).toHaveClass('rounded-xl')
        expect(item).toHaveClass('animate-pulse')
      })
    })
  })

  describe('Animation classes', () => {
    it('should have animate-pulse on all skeleton elements', () => {
      const { container } = render(<Loading />)

      const animatedElements = container.querySelectorAll('.animate-pulse')

      // Should have multiple animated elements (hero, stats, description, cost, gallery)
      expect(animatedElements.length).toBeGreaterThan(10)
    })
  })

  describe('Responsive grid classes', () => {
    it('should have responsive grid for stats', () => {
      const { container } = render(<Loading />)

      const statsGrid = container.querySelector('.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-5')
      expect(statsGrid).toBeInTheDocument()
    })

    it('should have responsive grid for cost breakdown', () => {
      const { container } = render(<Loading />)

      const costGrid = container.querySelector('.grid-cols-1.md\\:grid-cols-2')
      expect(costGrid).toBeInTheDocument()
    })

    it('should have responsive grid for gallery', () => {
      const { container } = render(<Loading />)

      const galleryGrid = container.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3')
      expect(galleryGrid).toBeInTheDocument()
    })
  })

  describe('Correct number of skeleton items', () => {
    it('should render exactly 5 stat skeleton items', () => {
      const { container } = render(<Loading />)

      const statsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-5')
      const statItems = statsGrid?.children

      expect(statItems?.length).toBe(5)
    })

    it('should render exactly 4 cost breakdown skeleton items', () => {
      const { container } = render(<Loading />)

      const costSection = Array.from(
        container.querySelectorAll('.bg-slate-800\\/50.backdrop-blur-sm.rounded-2xl.p-8.animate-pulse')
      ).find(el => {
        return el.querySelector('.grid.grid-cols-1.md\\:grid-cols-2') !== null
      })

      const costGrid = costSection?.querySelector('.grid')
      const costItems = costGrid?.children

      expect(costItems?.length).toBe(4)
    })

    it('should render exactly 4 gallery skeleton items', () => {
      const { container } = render(<Loading />)

      const galleryGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3')
      const galleryItems = galleryGrid?.children

      expect(galleryItems?.length).toBe(4)
    })
  })

  describe('Visual structure', () => {
    it('should have proper spacing between sections', () => {
      const { container } = render(<Loading />)

      const contentContainer = container.querySelector('.max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8.py-12.space-y-12')
      expect(contentContainer).toBeInTheDocument()
      expect(contentContainer).toHaveClass('space-y-12')
    })

    it('should have max-width container for content', () => {
      const { container } = render(<Loading />)

      const contentContainer = container.querySelector('.max-w-7xl')
      expect(contentContainer).toBeInTheDocument()
      expect(contentContainer).toHaveClass('mx-auto')
    })

    it('should have responsive padding', () => {
      const { container } = render(<Loading />)

      const contentContainer = container.querySelector('.px-4.sm\\:px-6.lg\\:px-8')
      expect(contentContainer).toBeInTheDocument()
    })
  })

  describe('Complete loading state', () => {
    it('should render all sections in loading state', () => {
      const { container } = render(<Loading />)

      // Hero skeleton
      expect(container.querySelector('.h-\\[500px\\]')).toBeInTheDocument()

      // Stats skeleton (5 items)
      const statsItems = container.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-5 > *')
      expect(statsItems.length).toBe(5)

      // Description skeleton
      const descSections = container.querySelectorAll('.bg-slate-800\\/50.backdrop-blur-sm.rounded-2xl.p-8.animate-pulse')
      expect(descSections.length).toBeGreaterThanOrEqual(2)

      // Gallery skeleton (4 items)
      const galleryItems = container.querySelectorAll('.aspect-video.bg-slate-800.rounded-xl.animate-pulse')
      expect(galleryItems.length).toBe(4)
    })

    it('should match the actual page structure in skeleton form', () => {
      const { container } = render(<Loading />)

      // Verify the order of sections matches the actual page
      const sections = container.querySelectorAll('.min-h-screen > *')

      // Should have hero section first
      expect(sections[0]).toHaveClass('relative')
      expect(sections[0]).toHaveClass('h-[500px]')

      // Should have content container second
      expect(sections[1]).toHaveClass('max-w-7xl')
    })
  })
})
