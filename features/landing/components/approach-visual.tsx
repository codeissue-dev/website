import Image from 'next/image';

import { WorkflowIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Dictionary } from '@/lib/i18n';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function ApproachVisual({ copy }: { copy: Dictionary['approach'] }) {
  return (
    <div
      className={cn(
        reveal,
        'relative min-h-[34rem] overflow-hidden rounded-2xl border border-white/12 bg-black',
      )}
      data-reveal
    >
      <Image
        src="/images/editorial/material-review.webp"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover opacity-75 grayscale-[0.15] transition-transform duration-[1400ms] ease-out [transform:scale(1.04)] [.is-visible_&]:scale-100"
        data-parallax="0.035"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.08),rgba(0,0,0,0.38)_48%,#000_100%)]" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/15" />

      <div className="relative flex min-h-[34rem] flex-col justify-between p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <Badge className="gap-2 border-white/12 bg-black/72 text-foreground backdrop-blur-md">
            <WorkflowIcon className="size-4 text-signal-soft" />
            {copy.label}
          </Badge>
          <span className="font-mono text-sm text-white/70">01 / 03</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-end">
          <div className="rounded-xl border border-white/12 bg-black/82 p-5 backdrop-blur-xl sm:p-6">
            <p className="font-mono text-sm text-signal-soft">
              {copy.principles.map((principle) => principle.number).join(' / ')}
            </p>
            <h3 className="mt-3 max-w-[20ch] text-2xl font-semibold tracking-[-0.045em]">
              {copy.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">
              {copy.description}
            </p>
            <Progress
              value={72}
              className="mt-6"
              indicatorClassName="bg-linear-to-r from-signal to-signal-soft"
            />
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/12 bg-black/82">
            <Image
              src="/images/editorial/workflow-board.webp"
              alt=""
              fill
              sizes="208px"
              className="object-cover grayscale-[0.25]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 font-mono text-sm text-white">
              issue / map
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
