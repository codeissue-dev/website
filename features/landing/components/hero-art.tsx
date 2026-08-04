import Image from 'next/image';

import { CheckIcon, CodeIssueMark } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function HeroArt({ copy }: { copy: Dictionary['hero']['ticket'] }) {
  return (
    <div
      className={cn(
        reveal,
        'relative mx-auto mt-14 w-full max-w-5xl [perspective:1400px] sm:mt-16',
      )}
      data-reveal
    >
      <div
        className="relative overflow-hidden rounded-xl border border-white/15 bg-card shadow-[0_24px_80px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.05)_inset] transform-[translate3d(var(--pointer-x,0px),calc(var(--pointer-y,0px)+var(--parallax-y,0px)),0)] transition-transform duration-300 ease-out motion-reduce:transform-none"
        data-parallax="0.08"
        aria-label={copy.title}
      >
        <div className="flex h-11 items-center gap-3 border-b border-border bg-black/70 px-4">
          <div className="flex gap-1.5" aria-hidden="true">
            <i className="size-2.5 rounded-full bg-zinc-700" />
            <i className="size-2.5 rounded-full bg-zinc-700" />
            <i className="size-2.5 rounded-full bg-zinc-700" />
          </div>
          <div className="mx-auto flex h-7 min-w-0 max-w-md flex-1 items-center justify-center rounded-md border border-border bg-surface px-3 font-mono text-sm text-muted-foreground">
            codeissue.dev/issues/001
          </div>
          <span className="hidden items-center gap-2 text-sm text-positive sm:flex">
            <i className="size-1.5 rounded-full bg-positive" />
            {copy.status}
          </span>
        </div>

        <div className="relative grid lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
          <div className="relative min-h-[25rem] overflow-hidden border-b border-border p-5 sm:p-8 lg:min-h-[30rem] lg:border-r lg:border-b-0">
            <Image
              src="/images/banner.png"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="animate-slow-drift object-cover opacity-[0.12] grayscale"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.3),#090909_84%)]" />
            <div className="relative flex h-full flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-signal/35 bg-signal/10 px-2.5 py-1 font-mono text-sm text-signal-soft">
                  {copy.id}
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  product / active
                </span>
              </div>

              <div className="my-auto py-10">
                <div className="flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-signal-soft">
                    <CodeIssueMark className="size-6" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">Codeissue</p>
                    <p className="font-mono text-sm text-muted-foreground">
                      owner / product team
                    </p>
                  </div>
                </div>
                <h3 className="mt-7 max-w-[18ch] text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                  {copy.title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  {copy.inputValue} -&gt; {copy.outputValue}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {copy.stages.map((stage, index) => (
                  <div
                    key={stage}
                    className="rounded-md border border-border bg-black/50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-muted-foreground">
                        0{index + 1}
                      </span>
                      {index < 2 ? (
                        <CheckIcon className="size-4 text-positive" />
                      ) : (
                        <i className="size-1.5 rounded-full bg-border-strong" />
                      )}
                    </div>
                    <strong className="mt-3 block text-sm font-medium">
                      {stage}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="grid content-between gap-8 bg-black/35 p-5 sm:p-7">
            <div>
              <p className="font-mono text-sm text-muted-foreground">
                ISSUE DETAILS
              </p>
              <dl className="mt-5 grid gap-5">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {copy.inputLabel}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    {copy.inputValue}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {copy.outputLabel}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-signal-soft">
                    {copy.outputValue}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {copy.ownerLabel}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    {copy.ownerValue}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {copy.reviewLabel}
                  </dt>
                  <dd className="mt-1 inline-flex items-center gap-2 text-sm font-medium">
                    <i className="size-1.5 rounded-full bg-positive" />
                    {copy.reviewValue}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <i className="size-1.5 rounded-full bg-signal" />
                Live workflow
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                <span className="block h-full w-[58%] rounded-full bg-linear-to-r from-signal to-signal-soft" />
              </div>
              <p className="mt-3 font-mono text-sm text-muted-foreground">
                58% / release path
              </p>
            </div>
          </aside>
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
