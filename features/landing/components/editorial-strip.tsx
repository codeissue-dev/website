import Image from 'next/image';

import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

const images = [
  '/images/editorial/workflow-wall.webp',
  '/images/editorial/material-review.webp',
  '/images/editorial/workflow-board.webp',
] as const;

export function EditorialStrip({ copy }: { copy: Dictionary['approach'] }) {
  return (
    <section className="border-y border-white/10 bg-black py-4 sm:py-5">
      <div className={pageFrame}>
        <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr_0.8fr]">
          {images.map((src, index) => {
            const principle = copy.principles[index] ?? copy.principles[0];
            return (
              <figure
                key={src}
                className={cn(
                  reveal,
                  'group relative h-44 overflow-hidden rounded-xl border border-white/10 bg-card sm:h-52',
                  index === 1 && 'md:h-64',
                )}
                data-reveal
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover opacity-58 grayscale-[0.25] transition-[transform,filter,opacity] duration-1000 ease-out group-hover:scale-[1.025] group-hover:grayscale-0 group-hover:opacity-75"
                  data-parallax={String(0.025 + index * 0.012)}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
                  <span className="max-w-[18ch] text-sm font-medium text-white">
                    {principle.title}
                  </span>
                  <span className="font-mono text-sm text-white/60">
                    {principle.number}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
