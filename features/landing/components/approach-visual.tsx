import Image from 'next/image';

import { CodeIssueMark, WorkflowIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Dictionary } from '@/lib/i18n';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function ApproachVisual({ copy }: { copy: Dictionary['approach'] }) {
  return (
    <Card
      className={cn(
        reveal,
        'relative min-h-[30rem] overflow-hidden border-white/12 bg-black',
      )}
      data-reveal
    >
      <Image
        src="/images/banner.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover opacity-35 grayscale"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.15),#000_72%)]" />
      <div
        className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:48px_48px]"
        aria-hidden="true"
      />

      <div className="relative flex min-h-[30rem] flex-col justify-between p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <Badge className="gap-2 border-white/12 bg-black/65 text-foreground backdrop-blur-md">
            <WorkflowIcon className="size-4 text-signal-soft" />
            {copy.label}
          </Badge>
          <span className="grid size-11 place-items-center rounded-lg border border-white/12 bg-black/65 text-signal-soft backdrop-blur-md">
            <CodeIssueMark className="size-6" />
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_11rem] sm:items-end">
          <Card className="border-white/12 bg-black/82 p-5 backdrop-blur-xl">
            <p className="font-mono text-sm text-muted-foreground">
              {copy.principles.map((principle) => principle.number).join(' / ')}
            </p>
            <h3 className="mt-3 max-w-[18ch] text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
              {copy.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {copy.description}
            </p>
            <Progress
              value={68}
              className="mt-6"
              indicatorClassName="bg-linear-to-r from-signal to-signal-soft"
            />
          </Card>

          <Card className="relative aspect-square overflow-hidden border-white/12 bg-black/82 backdrop-blur-xl">
            <Image
              src="/images/avatar.png"
              alt=""
              fill
              sizes="176px"
              className="object-cover opacity-70 grayscale"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 to-transparent" />
            <span className="absolute bottom-3 left-3 font-mono text-sm text-foreground">
              CI / 01
            </span>
          </Card>
        </div>
      </div>
    </Card>
  );
}
