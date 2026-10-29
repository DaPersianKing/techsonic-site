import { useEffect } from 'react';

/** Content remains visible if observers, motion, or JavaScript are unavailable. */
export function useSectionReveal() {
  useEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add('section-revealed');
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08 }
    );
    document
      .querySelectorAll('main section:not(.hero)')
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}
