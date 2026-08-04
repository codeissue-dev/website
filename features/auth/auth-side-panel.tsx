import { CheckIcon } from '@/components/icons';
import { BrandLink } from '@/components/layout/brand-link';
import type { Dictionary } from '@/lib/i18n';

export function AuthSidePanel({ copy }: { copy: Dictionary['auth'] }) {
  return (
    <section className="hidden border-r border-border bg-black/35 p-8 lg:flex lg:flex-col xl:p-10">
      <BrandLink />
      <div className="my-auto py-14">
        <p className="font-mono text-sm text-signal-soft">{copy.sideEyebrow}</p>
        <h1 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[1.02] tracking-[-0.055em] xl:text-5xl">
          {copy.sideTitle}
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
          {copy.sideDescription}
        </p>
      </div>
      <ul className="grid gap-3 border-t border-border pt-6">
        {copy.sideItems.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 text-sm text-muted-foreground"
          >
            <span className="grid size-6 place-items-center rounded-md border border-border bg-surface text-positive">
              <CheckIcon className="size-3.5" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
