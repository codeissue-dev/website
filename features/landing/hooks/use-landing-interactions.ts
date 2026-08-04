'use client';

import { useEffect, useRef } from 'react';

import type { Locale } from '@/lib/i18n';

export function useLandingInteractions(locale: Locale) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let frame = 0;

    root.lang = locale;

    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = root.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        progressRef.current?.style.setProperty(
          'transform',
          `scaleX(${progress})`,
        );
      });
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    );

    if (!reduceMotion) {
      document
        .querySelectorAll<HTMLElement>('[data-reveal]')
        .forEach((element) => revealObserver.observe(element));
    } else {
      document
        .querySelectorAll<HTMLElement>('[data-reveal]')
        .forEach((element) => element.classList.add('is-visible'));
    }

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateScroll);
      revealObserver.disconnect();
    };
  }, [locale]);

  return progressRef;
}
