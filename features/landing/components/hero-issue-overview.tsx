import Image from 'next/image';

import { CheckIcon, CodeIssueMark } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';

export function HeroIssueOverview({
  copy,
}: {
  copy: Dictionary['hero']['ticket'];
}) {
  return (
    <div className="relative min-h-100 overflow-hidden border-b border-border p-5 sm:p-8 lg:min-h-120 lg:border-r lg:border-b-0">
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
            <span className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/4 text-signal-soft">
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
                  {String(index + 1).padStart(2, '0')}
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
  );
}
