import Image from 'next/image';

import type { Dictionary } from '@/lib/i18n';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function ProcessVisual({ copy }: { copy: Dictionary['process'] }) {
  return (
    <div className="lg:sticky lg:top-28 lg:h-fit">
      <div
        className={cn(
          reveal,
          'relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6',
        )}
        data-reveal
      >
        <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-black">
          <div
            className="absolute inset-0 transform-[translate3d(0,var(--parallax-y,0px),0)] transition-transform duration-200 motion-reduce:transform-none"
            data-parallax="0.1"
          >
            <Image
              src="/images/avatar.png"
              alt="Codeissue workflow illustration"
              fill
              sizes="(max-width: 1024px) 100vw, 36vw"
              className="object-cover opacity-45 grayscale"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,#000_100%)]" />
          <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/10 bg-black/75 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-sm text-muted-foreground">
                {copy.currentLabel}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-positive">
                <i className="size-1.5 rounded-full bg-positive" />
                {copy.status}
              </span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
              <span className="block h-full w-3/4 rounded-full bg-linear-to-r from-signal to-signal-soft" />
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {copy.steps.map((step, index) => (
            <div
              key={step.number}
              className="rounded-md border border-border bg-black p-3 text-center"
            >
              <span className="font-mono text-sm text-signal-soft">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
