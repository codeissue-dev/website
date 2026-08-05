'use client';

import { useEffect, useRef } from 'react';

import type { Locale } from '@/lib/i18n';

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

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
    const processSection = document.querySelector<HTMLElement>(
      '[data-process-section]',
    );
    const processSteps = Array.from(
      document.querySelectorAll<HTMLElement>('[data-process-step]'),
    );
    const processVisual = document.querySelector<HTMLElement>(
      '[data-process-visual]',
    );
    const processScenes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-process-scene]'),
    );
    const processMarkers = Array.from(
      document.querySelectorAll<HTMLElement>('[data-process-marker]'),
    );
    const processProgress = document.querySelector<HTMLElement>(
      '[data-process-progress]',
    );
    const processProgressIndicator = document.querySelector<HTMLElement>(
      '[data-process-progress-indicator]',
    );
    const processProgressValue = document.querySelector<HTMLElement>(
      '[data-process-progress-value]',
    );
    const processStageTitle = document.querySelector<HTMLElement>(
      '[data-process-stage-title]',
    );
    let activeProcessStep = -1;
    let frame = 0;

    root.lang = locale;

    const setActiveProcessStep = (index: number) => {
      if (index === activeProcessStep || index < 0) return;
      activeProcessStep = index;
      processVisual?.setAttribute('data-active-step', String(index));

      processSteps.forEach((step, stepIndex) => {
        step.classList.toggle('is-current', stepIndex === index);
      });
      processScenes.forEach((scene, sceneIndex) => {
        const active = sceneIndex === index;
        scene.classList.toggle('is-active', active);
        scene.classList.toggle('opacity-100', active);
        scene.classList.toggle('[transform:scale(1)]', active);
        scene.classList.toggle('opacity-0', !active);
        scene.classList.toggle('[transform:scale(1.025)]', !active);
        scene.setAttribute('aria-hidden', String(!active));
      });
      processMarkers.forEach((marker, markerIndex) => {
        marker.classList.toggle('bg-signal', markerIndex <= index);
        marker.classList.toggle('bg-border', markerIndex > index);
      });

      const title = processSteps[index]?.querySelector('h3')?.textContent;
      if (title && processStageTitle) processStageTitle.textContent = title;
    };

    const renderMotion = () => {
      const scrollable = root.scrollHeight - window.innerHeight;
      const pageProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressRef.current?.style.setProperty(
        'transform',
        `scaleX(${pageProgress})`,
      );

      if (processSection && processSteps.length > 0) {
        const rect = processSection.getBoundingClientRect();
        const startLine = window.innerHeight * 0.72;
        const endLine = window.innerHeight * 0.24;
        const travel = rect.height + startLine - endLine;
        const processValue = clamp((startLine - rect.top) / travel);
        const processPercent = Math.round(processValue * 100);
        const processIndex = Math.min(
          processSteps.length - 1,
          Math.floor(processValue * processSteps.length),
        );

        processProgressIndicator?.style.setProperty(
          'transform',
          `scaleX(${processValue})`,
        );
        processProgress?.setAttribute('aria-valuenow', String(processPercent));
        if (processProgressValue) {
          processProgressValue.textContent = `${processPercent}%`;
        }
        setActiveProcessStep(processIndex);
      }

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
      const x = (event.clientX / window.innerWidth - 0.5) * 10;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
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

    const revealNodes = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (reduceMotion) {
      revealNodes.forEach((element) => element.classList.add('is-visible'));
      setActiveProcessStep(0);
    } else {
      revealNodes.forEach((element) => revealObserver.observe(element));
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
      root.style.removeProperty('--pointer-x');
      root.style.removeProperty('--pointer-y');
    };
  }, [locale]);

  return progressRef;
}
