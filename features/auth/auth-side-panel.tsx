import Image from 'next/image';

import { CheckIcon } from '@/components/icons';
import { BrandLink } from '@/components/layout/brand-link';
import type { Dictionary } from '@/lib/i18n';

export function AuthSidePanel({ copy }: { copy: Dictionary['auth'] }) {
  return (
    <section className="relative hidden overflow-hidden border-r border-border bg-black/35 p-8 lg:flex lg:flex-col xl:p-10">
      <Image
        src="/images/editorial/workflow-wall.webp"
        alt=""
        fill
        sizes="42vw"
        className="object-cover opacity-22 grayscale"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#000_0%,rgba(0,0,0,0.62)_46%,#000_100%)]" />
      <div className="relative flex min-h-full flex-1 flex-col">
        <BrandLink />
        <div className="my-auto py-14">
          <p className="font-mono text-sm text-signal-soft">
            {copy.sideEyebrow}
          </p>
          <h1 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[1.02] tracking-[-0.055em] xl:text-5xl">
            {copy.sideTitle}
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-zinc-300">
            {copy.sideDescription}
          </p>
        </div>
        <ul className="grid gap-3 border-t border-white/12 pt-6">
          {copy.sideItems.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 text-sm text-zinc-300"
            >
              <span className="grid size-6 place-items-center rounded-md border border-white/12 bg-black/70 text-positive">
                <CheckIcon className="size-3.5" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
