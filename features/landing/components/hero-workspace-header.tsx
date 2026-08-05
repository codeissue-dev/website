import { siteConfig } from '@/lib/config/site';

export function HeroWorkspaceHeader({ status }: { status: string }) {
  return (
    <div className="flex h-11 items-center gap-3 border-b border-border bg-black/70 px-4">
      <div className="flex gap-1.5" aria-hidden="true">
        <i className="size-2.5 rounded-full bg-zinc-700" />
        <i className="size-2.5 rounded-full bg-zinc-700" />
        <i className="size-2.5 rounded-full bg-zinc-700" />
      </div>
      <div className="mx-auto flex h-7 min-w-0 max-w-md flex-1 items-center justify-center rounded-md border border-border bg-surface px-3 font-mono text-sm text-muted-foreground">
        {new URL(siteConfig.url).hostname}/issues/001
      </div>
      <span className="hidden items-center gap-2 text-sm text-positive sm:flex">
        <i className="size-1.5 rounded-full bg-positive" />
        {status}
      </span>
    </div>
  );
}
