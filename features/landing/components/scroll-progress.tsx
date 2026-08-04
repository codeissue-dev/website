'use client';

import type { Locale } from '@/lib/i18n';

import { useLandingInteractions } from '../hooks/use-landing-interactions';

export function ScrollProgress({ locale }: { locale: Locale }) {
  const progressRef = useLandingInteractions(locale);

  return (
    <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
  );
}
