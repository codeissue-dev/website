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
    const desktopProcess = window.matchMedia('(min-width: 1024px)');
    const parallaxNodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]'),
    );
    const processSection = document.querySelector<HTMLElement>(
      '[data-process-section]',
    );
    const processSteps = Array.from(
      document.querySelectorAll<HTMLElement>('[data-process-step]'),
    );
    const processVisuals = Array.from(
      document.querySelectorAll<HTMLElement>('[data-process-visual]'),
    );
    const processProgresses = Array.from(
      document.querySelectorAll<HTMLElement>('[data-process-progress]'),
    );
    const processProgressIndicators = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-process-progress-indicator]',
      ),
    );
    const processProgressValues = Array.from(
      document.querySelectorAll<HTMLElement>('[data-process-progress-value]'),
    );
    const processStageTitles = Array.from(
      document.querySelectorAll<HTMLElement>('[data-process-stage-title]'),
    );
    const firstVisualScenes = processVisuals[0]
      ? Array.from(
          processVisuals[0].querySelectorAll<HTMLElement>(
            '[data-process-scene]',
          ),
        )
      : [];
    const stageCount = Math.max(1, firstVisualScenes.length);
    let activeProcessStep = -1;
    let frame = 0;

    root.lang = locale;

    const setActiveProcessStep = (index: number) => {
      if (index === activeProcessStep || index < 0) return;
      activeProcessStep = index;

      processVisuals.forEach((visual) => {
        visual.setAttribute('data-active-step', String(index));
        const scenes = Array.from(
          visual.querySelectorAll<HTMLElement>('[data-process-scene]'),
        );
        const markers = Array.from(
          visual.querySelectorAll<HTMLElement>('[data-process-marker]'),
        );

        scenes.forEach((scene, sceneIndex) => {
          const active = sceneIndex === index;
          scene.classList.toggle('is-active', active);
          scene.classList.toggle('opacity-100', active);
          scene.classList.toggle('[transform:scale(1)]', active);
          scene.classList.toggle('grayscale-0', active);
          scene.classList.toggle('opacity-0', !active);
          scene.classList.toggle('[transform:scale(1.045)]', !active);
          scene.classList.toggle('grayscale-[0.2]', !active);
          scene.setAttribute('aria-hidden', String(!active));
        });

        markers.forEach((marker, markerIndex) => {
          marker.classList.toggle('bg-signal', markerIndex <= index);
          marker.classList.toggle('bg-border', markerIndex > index);
        });
      });

      processSteps.forEach((step, stepIndex) => {
        step.classList.toggle('is-current', stepIndex % stageCount === index);
      });

      const title = copyStageTitle(index);
      if (title) {
        processStageTitles.forEach((node) => {
          node.textContent = title;
        });
      }
    };

    const copyStageTitle = (index: number) => {
      const candidate = processSteps.find(
        (_, stepIndex) => stepIndex % stageCount === index,
      );
      return candidate?.querySelector('h3')?.textContent ?? '';
    };

    const renderMotion = () => {
      const scrollable = root.scrollHeight - window.innerHeight;
      const pageProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressRef.current?.style.setProperty(
        'transform',
        `scaleX(${pageProgress})`,
      );

      if (processSection && stageCount > 0) {
        const rect = processSection.getBoundingClientRect();
        const processValue = desktopProcess.matches
          ? clamp(-rect.top / Math.max(1, rect.height - window.innerHeight))
          : clamp(
              (window.innerHeight * 0.72 - rect.top) /
                (rect.height + window.innerHeight * 0.48),
            );
        const processPercent = Math.round(processValue * 100);
        const processIndex = Math.min(
          stageCount - 1,
          Math.floor(processValue * stageCount),
        );

        processSection.style.setProperty(
          '--process-progress',
          String(processValue),
        );
        processProgressIndicators.forEach((indicator) => {
          indicator.style.setProperty('transform', `scaleX(${processValue})`);
        });
        processProgresses.forEach((progress) => {
          progress.setAttribute('aria-valuenow', String(processPercent));
        });
        processProgressValues.forEach((node) => {
          node.textContent = `${processPercent}%`;
        });
        setActiveProcessStep(processIndex);
      }

      if (reduceMotion) return;

      for (const node of parallaxNodes) {
        const speed = Number.parseFloat(node.dataset.parallax ?? '0.08');
        const rect = node.getBoundingClientRect();
        const centerOffset =
          rect.top + rect.height / 2 - window.innerHeight / 2;
        const translation = Math.max(
          -44,
          Math.min(44, centerOffset * speed * -0.12),
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
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 6;
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
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
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
      processSection?.style.removeProperty('--process-progress');
    };
  }, [locale]);

  return progressRef;
}
