'use client';

import type { Locale } from '@/lib/i18n';

import { useLandingInteractions } from '../hooks/use-landing-interactions';

export function ScrollProgress({ locale }: { locale: Locale }) {
  const progressRef = useLandingInteractions(locale);

  return (
    <div
      ref={progressRef}
      className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-left scale-x-0 bg-signal"
      aria-hidden="true"
    />
  );
}
