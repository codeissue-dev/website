import Image from 'next/image';

import {
  ChartIcon,
  DatabaseIcon,
  GitBranchIcon,
  LayersIcon,
  TerminalIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';

const visualIcons = [LayersIcon, TerminalIcon, GitBranchIcon, DatabaseIcon];
const images = [
  '/images/editorial/material-review.webp',
  '/images/editorial/workflow-wall.webp',
  '/images/editorial/workflow-board.webp',
] as const;

export function ServiceVisual({ index }: { index: number }) {
  const Icon = visualIcons[index] ?? LayersIcon;
  const image = images[index as 0 | 1 | 2];

  return (
    <div className="relative h-40 overflow-hidden border-b border-border bg-black">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-60 grayscale-[0.35] transition-[transform,filter,opacity] duration-700 group-hover:scale-[1.025] group-hover:grayscale-0 group-hover:opacity-75"
        />
      ) : (
        <div
          className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/25 to-signal/10" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <span className="absolute left-5 top-5 grid size-10 place-items-center rounded-md border border-white/12 bg-black/70 text-signal-soft backdrop-blur-md">
        <Icon className="size-5" />
      </span>

      {index === 0 ? (
        <div className="absolute bottom-5 right-5 grid w-40 grid-cols-3 gap-2 rounded-lg border border-white/10 bg-black/70 p-3 backdrop-blur-md">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <span
              key={item}
              className={cn(
                'h-5 rounded-sm border border-white/10 bg-white/[0.055]',
                item === 1 && 'col-span-2 border-signal/40 bg-signal/15',
              )}
            />
          ))}
        </div>
      ) : null}

      {index === 1 ? (
        <div className="absolute bottom-5 right-5 w-52 rounded-md border border-white/12 bg-black/78 p-3 font-mono text-sm backdrop-blur-md">
          <span className="block text-signal-soft">$ issue build</span>
          <span className="mt-2 block h-1.5 w-32 rounded-full bg-white/15" />
          <span className="mt-2 block h-1.5 w-24 rounded-full bg-positive/60" />
        </div>
      ) : null}

      {index === 2 ? (
        <div className="absolute bottom-5 right-5 flex items-center gap-3 rounded-lg border border-white/10 bg-black/72 p-3 backdrop-blur-md">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="grid size-9 place-items-center rounded-full border border-white/12 bg-black/72"
            >
              <i
                className={cn(
                  'size-2 rounded-full',
                  item === 1 ? 'bg-signal' : 'bg-white/35',
                )}
              />
            </span>
          ))}
          <GitBranchIcon className="size-5 text-muted-foreground" />
        </div>
      ) : null}

      {index === 3 ? (
        <div className="absolute bottom-5 right-5 flex items-end gap-2 rounded-lg border border-white/10 bg-black/72 p-3 backdrop-blur-md">
          {[38, 58, 82, 64, 100].map((height, item) => (
            <span
              key={item}
              className="w-5 rounded-t-sm bg-white/15"
              style={{ height: `${height * 0.65}px` }}
            />
          ))}
          <ChartIcon className="ml-2 size-5 text-positive" />
        </div>
      ) : null}
    </div>
  );
}
