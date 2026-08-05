import Image from 'next/image';

import {
  ChartIcon,
  CursorIcon,
  FileTextIcon,
  GitBranchIcon,
} from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const scenes = [
  {
    image: '/images/editorial/workflow-wall.webp',
    icon: FileTextIcon,
    position: 'object-center',
  },
  {
    image: '/images/editorial/material-review.webp',
    icon: CursorIcon,
    position: 'object-center',
  },
  {
    image: '/images/process/build.webp',
    icon: GitBranchIcon,
    position: 'object-center',
  },
  {
    image: '/images/process/review.webp',
    icon: ChartIcon,
    position: 'object-center',
  },
] as const;

export function ProcessVisual({
  copy,
  compact = false,
}: {
  copy: Dictionary['process'];
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/12 bg-card shadow-[0_30px_90px_rgba(0,0,0,0.65)]',
        compact ? 'min-h-[31rem]' : 'min-h-[32rem]',
      )}
      data-process-visual
      data-active-step="0"
    >
      <div className="absolute inset-0 bg-black">
        {copy.steps.map((step, index) => {
          const scene = scenes[index] ?? scenes[0];
          const Icon = scene.icon;

          return (
            <div
              key={step.number}
              className={cn(
                'absolute inset-0 opacity-0 transition-[opacity,transform,filter] duration-700 ease-out [transform:scale(1.045)] grayscale-[0.2]',
                index === 0 &&
                  'is-active opacity-100 [transform:scale(1)] grayscale-0',
              )}
              data-process-scene
              data-scene-index={index}
              aria-hidden={index !== 0}
            >
              <Image
                src={scene.image}
                alt=""
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className={cn('object-cover', scene.position)}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.2)_45%,#000_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.2),transparent_55%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <div className="flex max-w-xl items-start gap-4 rounded-xl border border-white/12 bg-black/78 p-4 backdrop-blur-xl sm:p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/[0.045] text-signal-soft">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="font-mono text-sm text-signal-soft">
                      {step.number}
                    </span>
                    <h3 className="mt-1 text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-300">
                      {step.copy}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-black/65 px-5 py-4 backdrop-blur-xl sm:px-6">
        <div>
          <p className="font-mono text-sm text-muted-foreground">
            {copy.currentLabel}
          </p>
          <p
            className="mt-1 text-sm font-medium text-foreground"
            data-process-stage-title
          >
            {copy.steps[0]?.title}
          </p>
        </div>
        <Badge className="gap-2 border-positive/25 bg-positive/8 text-positive">
          <i className="size-1.5 rounded-full bg-positive" aria-hidden="true" />
          {copy.status}
        </Badge>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/90 px-5 py-4 opacity-100 backdrop-blur-xl sm:px-6">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">{copy.currentLabel}</span>
          <span
            className="font-mono text-foreground"
            data-process-progress-value
          >
            0%
          </span>
        </div>
        <Progress
          value={0}
          className="mt-3"
          data-process-progress
          indicatorClassName="bg-linear-to-r from-signal to-signal-soft duration-75"
          indicatorProps={{ 'data-process-progress-indicator': '' }}
        />
        <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden="true">
          {copy.steps.map((step, index) => (
            <span
              key={step.number}
              className={cn(
                'h-1 rounded-full bg-border transition-colors duration-300',
                index === 0 && 'bg-signal',
              )}
              data-process-marker
              data-marker-index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
