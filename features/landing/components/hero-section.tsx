import type { Dictionary } from '@/lib/i18n';
import { pageFrame } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { HeroArt } from './hero-art';
import { HeroBackground } from './hero-background';
import { HeroContent } from './hero-content';

export function HeroSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <HeroBackground />
      <div
        className={cn(
          pageFrame,
          'relative pb-20 pt-20 sm:pt-24 lg:pb-28 lg:pt-28',
        )}
      >
        <HeroContent copy={copy.hero} />
        <HeroArt copy={copy.hero.ticket} />
      </div>
    </section>
  );
}
