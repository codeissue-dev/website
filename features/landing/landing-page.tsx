import type { Dictionary, Locale } from '@/lib/i18n';

import { ApproachSection } from './components/approach-section';
import { CtaSection } from './components/cta-section';
import { HeroSection } from './components/hero-section';
import { NetworkSection } from './components/network-section';
import { ProcessSection } from './components/process-section';
import { ScrollProgress } from './components/scroll-progress';
import { ServicesSection } from './components/services-section';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';

export function LandingPage({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary;
}) {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <ScrollProgress locale={locale} />
      <SiteHeader locale={locale} copy={copy} />

      <main>
        <HeroSection copy={copy} />
        <ApproachSection copy={copy} />
        <ProcessSection copy={copy} />
        <ServicesSection copy={copy} />
        <NetworkSection copy={copy} />
        <CtaSection copy={copy} />
      </main>

      <SiteFooter copy={copy} />
    </div>
  );
}
