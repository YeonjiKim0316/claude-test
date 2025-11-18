import { render, screen } from '@testing-library/react';
import CityHero from './city-hero';
import { mockCityDetails } from '@/lib/mock-data';
import { CityDetails } from '@/lib/types';

describe('CityHero', () => {
  // Test data
  const jejuCity = mockCityDetails[0]; // Popular badge
  const busanCity = mockCityDetails[1]; // Trending badge
  const gangneungCity = mockCityDetails[3]; // No badge

  describe('City Name Rendering', () => {
    it('renders city name correctly (name_ko)', () => {
      render(<CityHero city={jejuCity} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('제주');
    });

    it('renders different city names correctly', () => {
      const { rerender } = render(<CityHero city={busanCity} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('부산');

      rerender(<CityHero city={gangneungCity} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('강릉');
    });

    it('applies correct heading classes', () => {
      render(<CityHero city={jejuCity} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-5xl', 'md:text-6xl', 'font-bold', 'text-white', 'mb-4');
    });
  });

  describe('Region with MapPin Icon', () => {
    it('renders region text correctly', () => {
      render(<CityHero city={jejuCity} />);

      expect(screen.getByText('제주도')).toBeInTheDocument();
    });

    it('renders MapPin icon with region', () => {
      render(<CityHero city={jejuCity} />);

      const regionContainer = screen.getByText('제주도').closest('div');
      expect(regionContainer).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('applies correct region text classes', () => {
      render(<CityHero city={jejuCity} />);

      const regionContainer = screen.getByText('제주도').closest('div');
      expect(regionContainer).toHaveClass('text-xl', 'text-gray-300', 'mb-6');
    });

    it('renders different regions correctly', () => {
      const { rerender } = render(<CityHero city={jejuCity} />);
      expect(screen.getByText('제주도')).toBeInTheDocument();

      rerender(<CityHero city={busanCity} />);
      expect(screen.getByText('경상도')).toBeInTheDocument();

      rerender(<CityHero city={gangneungCity} />);
      expect(screen.getByText('강원도')).toBeInTheDocument();
    });
  });

  describe('Description Text', () => {
    it('renders description text correctly', () => {
      render(<CityHero city={jejuCity} />);

      const description = screen.getByText(/제주는 대한민국 최고의 디지털 노마드 천국입니다/);
      expect(description).toBeInTheDocument();
    });

    it('applies correct description classes', () => {
      render(<CityHero city={jejuCity} />);

      const description = screen.getByText(/제주는 대한민국 최고의 디지털 노마드 천국입니다/);
      expect(description).toHaveClass('text-lg', 'text-gray-200', 'max-w-3xl', 'leading-relaxed');
    });

    it('renders full description content', () => {
      render(<CityHero city={jejuCity} />);

      expect(screen.getByText(jejuCity.description)).toBeInTheDocument();
    });
  });

  describe('Badge for Popular Cities', () => {
    it('renders badge for Popular cities with correct emoji', () => {
      render(<CityHero city={jejuCity} />);

      const badge = screen.getByText('인기');
      expect(badge).toBeInTheDocument();
    });

    it('applies correct Popular badge classes', () => {
      render(<CityHero city={jejuCity} />);

      const badge = screen.getByText('인기');
      expect(badge).toHaveClass(
        'px-4',
        'py-1.5',
        'rounded-full',
        'text-sm',
        'font-bold',
        'shadow-lg',
        'bg-gradient-to-r',
        'from-orange-500',
        'to-pink-500',
        'text-white'
      );
    });

    it('renders Popular badge in correct container', () => {
      render(<CityHero city={jejuCity} />);

      const badge = screen.getByText('인기');
      const container = badge.closest('div');
      expect(container).toHaveClass('inline-block', 'mb-4');
    });
  });

  describe('Badge for Trending Cities', () => {
    it('renders badge for Trending cities with correct emoji', () => {
      render(<CityHero city={busanCity} />);

      const badge = screen.getByText('트렌딩');
      expect(badge).toBeInTheDocument();
    });

    it('applies correct Trending badge classes', () => {
      render(<CityHero city={busanCity} />);

      const badge = screen.getByText('트렌딩');
      expect(badge).toHaveClass(
        'px-4',
        'py-1.5',
        'rounded-full',
        'text-sm',
        'font-bold',
        'shadow-lg',
        'bg-gradient-to-r',
        'from-green-500',
        'to-emerald-500',
        'text-white'
      );
    });
  });

  describe('Badge when null', () => {
    it('does not render badge when badge is null', () => {
      render(<CityHero city={gangneungCity} />);

      expect(screen.queryByText('인기')).not.toBeInTheDocument();
      expect(screen.queryByText('트렌딩')).not.toBeInTheDocument();
    });

    it('does not render badge container when badge is null', () => {
      const { container } = render(<CityHero city={gangneungCity} />);

      const badgeContainer = container.querySelector('.inline-block.mb-4');
      expect(badgeContainer).not.toBeInTheDocument();
    });
  });

  describe('Next.js Image Component', () => {
    it('renders Image with correct src prop', () => {
      render(<CityHero city={jejuCity} />);

      const image = screen.getByAltText('제주');
      expect(image).toHaveAttribute('src', jejuCity.image_url);
    });

    it('renders Image with correct alt prop', () => {
      render(<CityHero city={jejuCity} />);

      const image = screen.getByAltText('제주');
      expect(image).toBeInTheDocument();
    });

    it('renders Image with fill prop', () => {
      render(<CityHero city={jejuCity} />);

      const image = screen.getByAltText('제주');
      expect(image).toHaveAttribute('fill');
    });

    it('renders Image with priority prop', () => {
      render(<CityHero city={jejuCity} />);

      const image = screen.getByAltText('제주');
      expect(image).toHaveAttribute('priority');
    });

    it('applies object-cover class to Image', () => {
      render(<CityHero city={jejuCity} />);

      const image = screen.getByAltText('제주');
      expect(image).toHaveClass('object-cover');
    });

    it('renders different city images correctly', () => {
      const { rerender } = render(<CityHero city={jejuCity} />);

      let image = screen.getByAltText('제주');
      expect(image).toHaveAttribute('src', jejuCity.image_url);

      rerender(<CityHero city={busanCity} />);
      image = screen.getByAltText('부산');
      expect(image).toHaveAttribute('src', busanCity.image_url);
    });
  });

  describe('Gradient Overlay', () => {
    it('renders gradient overlay with correct classes', () => {
      const { container } = render(<CityHero city={jejuCity} />);

      const overlay = container.querySelector('.bg-gradient-to-t');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass(
        'absolute',
        'inset-0',
        'bg-gradient-to-t',
        'from-slate-900',
        'via-slate-900/50',
        'to-transparent'
      );
    });

    it('overlay is positioned absolutely', () => {
      const { container } = render(<CityHero city={jejuCity} />);

      const overlay = container.querySelector('.bg-gradient-to-t');
      expect(overlay).toHaveClass('absolute', 'inset-0');
    });
  });

  describe('Responsive Height Classes', () => {
    it('applies correct height class to main container', () => {
      const { container } = render(<CityHero city={jejuCity} />);

      const mainContainer = container.querySelector('.relative.h-\\[500px\\]');
      expect(mainContainer).toBeInTheDocument();
    });

    it('applies responsive container classes', () => {
      const { container } = render(<CityHero city={jejuCity} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('relative', 'h-[500px]', 'w-full', 'overflow-hidden');
    });

    it('applies max-width constraint to content', () => {
      const { container } = render(<CityHero city={jejuCity} />);

      const contentContainer = container.querySelector('.max-w-7xl');
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass('max-w-7xl', 'mx-auto');
    });

    it('positions content absolutely at bottom', () => {
      const { container } = render(<CityHero city={jejuCity} />);

      const contentWrapper = container.querySelector('.absolute.bottom-0');
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper).toHaveClass('absolute', 'bottom-0', 'left-0', 'right-0', 'p-8');
    });
  });

  describe('Component Structure', () => {
    it('renders all main sections in correct order', () => {
      const { container } = render(<CityHero city={jejuCity} />);

      // Main container
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('relative');

      // Image should be first
      const image = screen.getByAltText('제주');
      expect(image).toBeInTheDocument();

      // Overlay should exist
      const overlay = container.querySelector('.bg-gradient-to-t');
      expect(overlay).toBeInTheDocument();

      // Content should be last
      const contentWrapper = container.querySelector('.absolute.bottom-0');
      expect(contentWrapper).toBeInTheDocument();
    });

    it('maintains proper DOM hierarchy', () => {
      const { container } = render(<CityHero city={jejuCity} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer.children.length).toBe(3); // Image, Overlay, Content
    });
  });

  describe('Integration Tests', () => {
    it('renders complete Popular city hero correctly', () => {
      render(<CityHero city={jejuCity} />);

      // Check all elements are present
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('제주');
      expect(screen.getByText('제주도')).toBeInTheDocument();
      expect(screen.getByText('인기')).toBeInTheDocument();
      expect(screen.getByText(jejuCity.description)).toBeInTheDocument();
      expect(screen.getByAltText('제주')).toBeInTheDocument();
    });

    it('renders complete Trending city hero correctly', () => {
      render(<CityHero city={busanCity} />);

      // Check all elements are present
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('부산');
      expect(screen.getByText('경상도')).toBeInTheDocument();
      expect(screen.getByText('트렌딩')).toBeInTheDocument();
      expect(screen.getByText(busanCity.description)).toBeInTheDocument();
      expect(screen.getByAltText('부산')).toBeInTheDocument();
    });

    it('renders complete city hero without badge correctly', () => {
      render(<CityHero city={gangneungCity} />);

      // Check all elements are present except badge
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('강릉');
      expect(screen.getByText('강원도')).toBeInTheDocument();
      expect(screen.queryByText('인기')).not.toBeInTheDocument();
      expect(screen.queryByText('트렌딩')).not.toBeInTheDocument();
      expect(screen.getByText(gangneungCity.description)).toBeInTheDocument();
      expect(screen.getByAltText('강릉')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles city with empty description', () => {
      const cityWithEmptyDesc: CityDetails = {
        ...jejuCity,
        description: '',
      };

      const { container } = render(<CityHero city={cityWithEmptyDesc} />);

      const description = container.querySelector('.text-lg.text-gray-200');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('');
    });

    it('handles city with long name', () => {
      const cityWithLongName: CityDetails = {
        ...jejuCity,
        name_ko: '매우 긴 도시 이름을 가진 도시',
      };

      render(<CityHero city={cityWithLongName} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('매우 긴 도시 이름을 가진 도시');
    });

    it('handles all possible badge values', () => {
      const { rerender } = render(<CityHero city={jejuCity} />);
      expect(screen.getByText('인기')).toBeInTheDocument();

      rerender(<CityHero city={busanCity} />);
      expect(screen.getByText('트렌딩')).toBeInTheDocument();

      rerender(<CityHero city={gangneungCity} />);
      expect(screen.queryByText('인기')).not.toBeInTheDocument();
      expect(screen.queryByText('트렌딩')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<CityHero city={jejuCity} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('image has descriptive alt text', () => {
      render(<CityHero city={jejuCity} />);

      const image = screen.getByAltText('제주');
      expect(image).toBeInTheDocument();
    });

    it('uses semantic HTML structure', () => {
      const { container } = render(<CityHero city={jejuCity} />);

      // Check for h1
      expect(container.querySelector('h1')).toBeInTheDocument();

      // Check for paragraph
      expect(container.querySelector('p')).toBeInTheDocument();
    });
  });
});
