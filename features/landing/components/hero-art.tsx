import type { Dictionary } from '@/lib/i18n';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { HeroIssueDetails } from './hero-issue-details';
import { HeroIssueOverview } from './hero-issue-overview';
import { HeroWorkspaceHeader } from './hero-workspace-header';

export function HeroArt({ copy }: { copy: Dictionary['hero']['ticket'] }) {
  return (
    <div
      className={cn(
        reveal,
        'relative mx-auto mt-14 w-full max-w-5xl perspective-[1400px] sm:mt-16',
      )}
      data-reveal
    >
      <div
        className="relative overflow-hidden rounded-xl border border-white/15 bg-card shadow-[0_24px_80px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.05)_inset] transform-[translate3d(var(--pointer-x,0px),calc(var(--pointer-y,0px)+var(--parallax-y,0px)),0)] transition-transform duration-300 ease-out motion-reduce:transform-none"
        data-parallax="0.08"
        aria-label={copy.title}
      >
        <HeroWorkspaceHeader status={copy.status} />
        <div className="relative grid lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
          <HeroIssueOverview copy={copy} />
          <HeroIssueDetails copy={copy} />
        </div>
        <span
          className="absolute left-0 right-0 top-12 h-px animate-signal-scan bg-linear-to-r from-transparent via-signal/50 to-transparent motion-reduce:hidden"
          aria-hidden="true"
        />
      </div>
      <div
        className="pointer-events-none absolute -inset-x-20 -bottom-16 -z-10 h-48 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.16),transparent_70%)] blur-2xl"
        aria-hidden="true"
      />
    </div>
  );
}
