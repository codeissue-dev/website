import Image from 'next/image';

import type { Dictionary } from '@/lib/i18n';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function HeroArt({ copy }: { copy: Dictionary['hero']['ticket'] }) {
  return (
    <aside
      className={cn(
        reveal,
        'relative min-h-[28rem] overflow-hidden border-t border-border bg-black sm:min-h-[34rem] lg:min-h-0 lg:border-t-0',
      )}
      data-reveal
      aria-label={copy.title}
    >
      <div
        className="absolute inset-0 [transform:translate3d(var(--pointer-x,0px),calc(var(--pointer-y,0px)+var(--parallax-y,0px)),0)] transition-transform duration-200 ease-out motion-reduce:transform-none"
        data-parallax="0.1"
      >
        <Image
          src="/images/banner.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="animate-slow-drift object-cover opacity-55 grayscale"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,transparent_38%,transparent_72%,#000_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#000_0%,transparent_20%,transparent_76%,#000_100%)]" />
      <div
        className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:3.5rem_3.5rem]"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-border bg-black/70 px-5 py-4 font-mono text-sm tracking-[0.08em] text-muted-foreground backdrop-blur-sm sm:px-7">
        <span className="text-signal">{copy.id}</span>
        <span className="flex items-center gap-2">
          <i className="size-2 bg-positive" aria-hidden="true" />
          {copy.status}
        </span>
      </div>

      <div className="absolute inset-0 grid place-items-center p-10">
        <div
          className="relative w-[min(72%,22rem)] [transform:translate3d(calc(var(--pointer-x,0px)*-0.35),calc(var(--pointer-y,0px)*-0.35),0)] transition-transform duration-300 ease-out motion-reduce:transform-none"
          data-parallax="0.16"
        >
          <div className="absolute -inset-8 border border-signal/25" />
          <div className="absolute -inset-4 border border-white/10" />
          <Image
            src="/images/codeissue-mark.svg"
            alt="Codeissue"
            width={420}
            height={420}
            className="relative h-auto w-full drop-shadow-[0_0_34px_rgba(148,141,255,0.35)]"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 border-t border-border bg-black/80 backdrop-blur-sm">
        <div className="border-r border-border p-5 sm:p-6">
          <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
            {copy.inputLabel}
          </span>
          <strong className="mt-2 block text-sm font-medium sm:text-base">
            {copy.inputValue}
          </strong>
        </div>
        <div className="p-5 sm:p-6">
          <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
            {copy.outputLabel}
          </span>
          <strong className="mt-2 block text-sm font-medium text-signal-soft sm:text-base">
            {copy.outputValue}
          </strong>
        </div>
      </div>

      <span
        className="absolute left-0 right-0 top-20 h-px animate-signal-scan bg-gradient-to-r from-transparent via-signal/65 to-transparent motion-reduce:hidden"
        aria-hidden="true"
      />
    </aside>
  );
}
