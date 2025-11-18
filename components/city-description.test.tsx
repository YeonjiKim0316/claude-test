import { render, screen } from '@testing-library/react';
import CityDescription from './city-description';
import { mockCityDetails } from '@/lib/mock-data';
import { CityDetails } from '@/lib/types';

describe('CityDescription', () => {
  const testCity: CityDetails = mockCityDetails[0]; // Jeju city data

  describe('Highlights Section', () => {
    it('renders highlights section with all highlight items', () => {
      render(<CityDescription city={testCity} />);

      // Check for section title
      expect(screen.getByText('주요 특징')).toBeInTheDocument();

      // Check all highlights are rendered
      testCity.highlights.forEach((highlight) => {
        expect(screen.getByText(highlight)).toBeInTheDocument();
      });
    });

    it('renders each highlight with Sparkles icon in section header', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check for Sparkles icon in the header
      const highlightsSection = container.querySelector('.bg-purple-500\\/10');
      expect(highlightsSection).toBeInTheDocument();

      // Verify section has correct styling
      const headerDiv = screen.getByText('주요 특징').closest('div');
      expect(headerDiv).toHaveClass('flex', 'items-center', 'gap-3', 'mb-6');
    });

    it('displays correct number of highlight items', () => {
      render(<CityDescription city={testCity} />);

      // Jeju has 5 highlights
      expect(testCity.highlights).toHaveLength(5);

      // Verify all are rendered
      testCity.highlights.forEach((highlight) => {
        expect(screen.getByText(highlight)).toBeInTheDocument();
      });
    });

    it('renders highlight items with proper list structure', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Find the highlights list
      const highlightsList = container.querySelector('.space-y-3');
      expect(highlightsList).toBeInTheDocument();

      // Check list items
      const listItems = highlightsList?.querySelectorAll('li');
      expect(listItems?.length).toBe(testCity.highlights.length);
    });
  });

  describe('Pros Section', () => {
    it('renders pros section with CheckCircle icons (green)', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check for pros section title
      expect(screen.getByText('장점')).toBeInTheDocument();

      // Check for green border and styling
      const prosSection = container.querySelector('.border-green-500\\/20');
      expect(prosSection).toBeInTheDocument();

      // Check for green CheckCircle icon in header
      const greenIconContainer = container.querySelector('.bg-green-500\\/10');
      expect(greenIconContainer).toBeInTheDocument();
    });

    it('displays all pros items from city data', () => {
      render(<CityDescription city={testCity} />);

      // Check all pros are rendered
      testCity.pros.forEach((pro) => {
        expect(screen.getByText(pro)).toBeInTheDocument();
      });
    });

    it('renders correct number of pros items', () => {
      render(<CityDescription city={testCity} />);

      // Jeju has 3 pros
      expect(testCity.pros).toHaveLength(3);

      testCity.pros.forEach((pro) => {
        expect(screen.getByText(pro)).toBeInTheDocument();
      });
    });

    it('displays CheckCircle icon for each pro item', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Find pros section
      const prosSection = container.querySelector('.border-green-500\\/20');
      expect(prosSection).toBeInTheDocument();

      // Check for green text class on icons
      const greenIcons = prosSection?.querySelectorAll('.text-green-400');
      // Should have 1 in header + 3 for each pro item = 4 total
      expect(greenIcons?.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Cons Section', () => {
    it('renders cons section with XCircle icons (red)', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check for cons section title
      expect(screen.getByText('단점')).toBeInTheDocument();

      // Check for red border and styling
      const consSection = container.querySelector('.border-red-500\\/20');
      expect(consSection).toBeInTheDocument();

      // Check for red XCircle icon in header
      const redIconContainer = container.querySelector('.bg-red-500\\/10');
      expect(redIconContainer).toBeInTheDocument();
    });

    it('displays all cons items from city data', () => {
      render(<CityDescription city={testCity} />);

      // Check all cons are rendered
      testCity.cons.forEach((con) => {
        expect(screen.getByText(con)).toBeInTheDocument();
      });
    });

    it('renders correct number of cons items', () => {
      render(<CityDescription city={testCity} />);

      // Jeju has 3 cons
      expect(testCity.cons).toHaveLength(3);

      testCity.cons.forEach((con) => {
        expect(screen.getByText(con)).toBeInTheDocument();
      });
    });

    it('displays XCircle icon for each con item', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Find cons section
      const consSection = container.querySelector('.border-red-500\\/20');
      expect(consSection).toBeInTheDocument();

      // Check for red text class on icons
      const redIcons = consSection?.querySelectorAll('.text-red-400');
      // Should have 1 in header + 3 for each con item = 4 total
      expect(redIcons?.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Layout and Styling', () => {
    it('renders two-column layout for pros/cons on desktop', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check for grid layout
      const gridContainer = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();

      // Verify it has gap-6 class
      expect(gridContainer).toHaveClass('gap-6');
    });

    it('applies correct color coding (green for pros, red for cons)', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check pros section has green styling
      const prosSection = container.querySelector('.border-green-500\\/20');
      expect(prosSection).toBeInTheDocument();
      expect(prosSection?.querySelector('.bg-green-500\\/10')).toBeInTheDocument();

      // Check cons section has red styling
      const consSection = container.querySelector('.border-red-500\\/20');
      expect(consSection).toBeInTheDocument();
      expect(consSection?.querySelector('.bg-red-500\\/10')).toBeInTheDocument();
    });

    it('applies backdrop blur and slate background to all sections', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check all sections have slate background with blur
      const sections = container.querySelectorAll('.bg-slate-800\\/50.backdrop-blur-sm');
      expect(sections.length).toBeGreaterThanOrEqual(3); // highlights + pros + cons
    });

    it('applies rounded corners to all sections', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check all sections have rounded-2xl
      const sections = container.querySelectorAll('.rounded-2xl');
      expect(sections.length).toBeGreaterThanOrEqual(3);
    });

    it('has proper spacing between sections', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check main container has space-y-8
      const mainContainer = container.querySelector('.space-y-8');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Different City Data', () => {
    it('renders correctly with Busan city data', () => {
      const busanCity = mockCityDetails[1]; // Busan
      render(<CityDescription city={busanCity} />);

      // Check highlights
      busanCity.highlights.forEach((highlight) => {
        expect(screen.getByText(highlight)).toBeInTheDocument();
      });

      // Check pros
      busanCity.pros.forEach((pro) => {
        expect(screen.getByText(pro)).toBeInTheDocument();
      });

      // Check cons
      busanCity.cons.forEach((con) => {
        expect(screen.getByText(con)).toBeInTheDocument();
      });
    });

    it('renders correctly with Seoul Gangnam city data', () => {
      const gangnamCity = mockCityDetails[2]; // Seoul Gangnam
      render(<CityDescription city={gangnamCity} />);

      // Check highlights
      gangnamCity.highlights.forEach((highlight) => {
        expect(screen.getByText(highlight)).toBeInTheDocument();
      });

      // Check pros
      gangnamCity.pros.forEach((pro) => {
        expect(screen.getByText(pro)).toBeInTheDocument();
      });

      // Check cons
      gangnamCity.cons.forEach((con) => {
        expect(screen.getByText(con)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML list elements', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check for ul elements
      const lists = container.querySelectorAll('ul');
      expect(lists.length).toBeGreaterThanOrEqual(3); // highlights + pros + cons
    });

    it('uses heading elements for section titles', () => {
      render(<CityDescription city={testCity} />);

      // Check for section headings
      expect(screen.getByText('주요 특징')).toBeInTheDocument();
      expect(screen.getByText('장점')).toBeInTheDocument();
      expect(screen.getByText('단점')).toBeInTheDocument();
    });

    it('renders readable text with proper contrast classes', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check for text-white class on headings
      const headings = container.querySelectorAll('.text-white');
      expect(headings.length).toBeGreaterThanOrEqual(3);

      // Check for text-gray-300 class on list items
      const listItems = container.querySelectorAll('.text-gray-300');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('Icon Rendering', () => {
    it('renders Sparkles icon with correct color', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check for purple-colored Sparkles icon
      const sparklesIcon = container.querySelector('.text-purple-400');
      expect(sparklesIcon).toBeInTheDocument();
    });

    it('renders CheckCircle icons with correct size and color', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check for green CheckCircle icons with proper sizing
      const greenIcons = container.querySelectorAll('.text-green-400');
      expect(greenIcons.length).toBeGreaterThan(0);
    });

    it('renders XCircle icons with correct size and color', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check for red XCircle icons with proper sizing
      const redIcons = container.querySelectorAll('.text-red-400');
      expect(redIcons.length).toBeGreaterThan(0);
    });

    it('renders icons with flex-shrink-0 class to prevent shrinking', () => {
      const { container } = render(<CityDescription city={testCity} />);

      // Check for flex-shrink-0 class on icons
      const noShrinkIcons = container.querySelectorAll('.flex-shrink-0');
      expect(noShrinkIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles city with minimum data gracefully', () => {
      const minimalCity: CityDetails = {
        ...testCity,
        highlights: ['Only one highlight'],
        pros: ['Only one pro'],
        cons: ['Only one con'],
      };

      render(<CityDescription city={minimalCity} />);

      expect(screen.getByText('Only one highlight')).toBeInTheDocument();
      expect(screen.getByText('Only one pro')).toBeInTheDocument();
      expect(screen.getByText('Only one con')).toBeInTheDocument();
    });

    it('handles city with many items', () => {
      const maximalCity: CityDetails = {
        ...testCity,
        highlights: Array(10).fill('Highlight').map((h, i) => `${h} ${i + 1}`),
        pros: Array(10).fill('Pro').map((p, i) => `${p} ${i + 1}`),
        cons: Array(10).fill('Con').map((c, i) => `${c} ${i + 1}`),
      };

      render(<CityDescription city={maximalCity} />);

      // Check all items are rendered
      expect(screen.getByText('Highlight 1')).toBeInTheDocument();
      expect(screen.getByText('Highlight 10')).toBeInTheDocument();
      expect(screen.getByText('Pro 1')).toBeInTheDocument();
      expect(screen.getByText('Pro 10')).toBeInTheDocument();
      expect(screen.getByText('Con 1')).toBeInTheDocument();
      expect(screen.getByText('Con 10')).toBeInTheDocument();
    });

    it('handles long text content without breaking layout', () => {
      const longTextCity: CityDetails = {
        ...testCity,
        highlights: ['This is a very long highlight text that should wrap properly and not break the layout of the component even with extensive content'],
        pros: ['This is a very long pro description that includes multiple points and details about why this is a positive aspect of the city'],
        cons: ['This is a very long con description explaining in detail the negative aspects and challenges that one might face'],
      };

      const { container } = render(<CityDescription city={longTextCity} />);

      // Check content is rendered
      expect(screen.getByText(/very long highlight text/)).toBeInTheDocument();
      expect(screen.getByText(/very long pro description/)).toBeInTheDocument();
      expect(screen.getByText(/very long con description/)).toBeInTheDocument();

      // Check layout classes are still applied
      expect(container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2')).toBeInTheDocument();
    });
  });
});
