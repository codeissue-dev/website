'use client';

import type { Dictionary, Locale } from '@/lib/i18n';

import { ApproachSection } from './components/approach-section';
import { CtaSection } from './components/cta-section';
import { HeroSection } from './components/hero-section';
import { NetworkSection } from './components/network-section';
import { ProcessSection } from './components/process-section';
import { ServicesSection } from './components/services-section';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import { useLandingInteractions } from './hooks/use-landing-interactions';

export function LandingPage({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary;
}) {
  const { activeProcess, progressRef } = useLandingInteractions(locale);

  return (
    <div className="site-shell">
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />

      <SiteHeader locale={locale} copy={copy} />

      <main>
        <HeroSection copy={copy} />
        <ApproachSection copy={copy} />
        <ProcessSection copy={copy} activeProcess={activeProcess} />
        <ServicesSection copy={copy} />
        <NetworkSection copy={copy} />
        <CtaSection copy={copy} />
      </main>

      <SiteFooter copy={copy} />
    </div>
  );
}
