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
    const parallaxNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]'),
    );
    const processSteps = Array.from(
      document.querySelectorAll<HTMLElement>('[data-process-step]'),
    );
    let frame = 0;

    root.lang = locale;

    const renderMotion = () => {
      const scrollable = root.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressRef.current?.style.setProperty(
        'transform',
        `scaleX(${progress})`,
      );

      if (reduceMotion) return;

      for (const node of parallaxNodes) {
        const speed = Number.parseFloat(node.dataset.parallax ?? '0.08');
        const rect = node.getBoundingClientRect();
        const centerOffset =
          rect.top + rect.height / 2 - window.innerHeight / 2;
        const translation = Math.max(
          -48,
          Math.min(48, centerOffset * speed * -0.12),
        );
        node.style.setProperty('--parallax-y', `${translation}px`);
      }
    };

    const scheduleMotion = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(renderMotion);
    };

    const updatePointer = (event: PointerEvent) => {
      if (reduceMotion || event.pointerType === 'touch') return;
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 14;
      root.style.setProperty('--pointer-x', `${x.toFixed(2)}px`);
      root.style.setProperty('--pointer-y', `${y.toFixed(2)}px`);
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

    const processObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          processSteps.forEach((step) => step.classList.remove('is-current'));
          entry.target.classList.add('is-current');
        }
      },
      { threshold: 0.55, rootMargin: '-18% 0px -28% 0px' },
    );

    const revealNodes = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (reduceMotion) {
      revealNodes.forEach((element) => element.classList.add('is-visible'));
    } else {
      revealNodes.forEach((element) => revealObserver.observe(element));
      processSteps.forEach((step) => processObserver.observe(step));
      window.addEventListener('pointermove', updatePointer, { passive: true });
    }

    renderMotion();
    window.addEventListener('scroll', scheduleMotion, { passive: true });
    window.addEventListener('resize', scheduleMotion);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleMotion);
      window.removeEventListener('resize', scheduleMotion);
      window.removeEventListener('pointermove', updatePointer);
      revealObserver.disconnect();
      processObserver.disconnect();
      root.style.removeProperty('--pointer-x');
      root.style.removeProperty('--pointer-y');
    };
  }, [locale]);

  return progressRef;
}
