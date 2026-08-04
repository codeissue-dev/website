'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/i18n';

export function useLandingInteractions(locale: Locale) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeProcess, setActiveProcess] = useState(0);

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
        root.style.setProperty('--page-scroll', `${window.scrollY}px`);
      });
    };

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      root.style.setProperty('--pointer-x', `${x}`);
      root.style.setProperty('--pointer-y', `${y}`);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    );

    document
      .querySelectorAll<HTMLElement>('[data-reveal]')
      .forEach((element) => revealObserver.observe(element));

    const processObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const nextStep = Number(visible.target.getAttribute('data-step'));
          if (Number.isInteger(nextStep)) setActiveProcess(nextStep);
        }
      },
      { threshold: [0.35, 0.6, 0.82], rootMargin: '-24% 0px -35% 0px' },
    );

    document
      .querySelectorAll<HTMLElement>('[data-process-step]')
      .forEach((element) => processObserver.observe(element));

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    if (!reduceMotion) {
      window.addEventListener('pointermove', updatePointer, { passive: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('pointermove', updatePointer);
      revealObserver.disconnect();
      processObserver.disconnect();
      root.style.removeProperty('--pointer-x');
      root.style.removeProperty('--pointer-y');
      root.style.removeProperty('--page-scroll');
    };
  }, [locale]);

  return { activeProcess, progressRef };
}
