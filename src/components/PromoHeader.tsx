'use client';

import { useEffect, useState } from 'react';

interface PromoHeaderProps {
  isVisible: boolean;
}

export default function PromoHeader({ isVisible }: PromoHeaderProps) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] bg-[#FF6B35] text-white transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <a
        href="https://sureprompts.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-[#E5582A] transition-colors"
      >
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">✨</span>
            <span className="text-sm sm:text-base font-medium">
              Generate Better Prompts For Free → Try <strong>SurePrompts</strong>
            </span>
            <svg
              className="w-5 h-5 ml-1 hidden sm:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < 5) {
        ticking = false;
        return;
      }

      // Show promo header when scrolling down past 100px
      if (scrollY > 100 && scrollY > lastScrollY) {
        setScrollDirection('down');
        setShowPromo(true);
      } else if (scrollY < lastScrollY) {
        setScrollDirection('up');
        setShowPromo(false);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollDirection, showPromo };
}