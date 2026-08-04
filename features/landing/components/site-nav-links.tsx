import { navigation } from '@/lib/site-data';
import type { Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function SiteNavLinks({
  copy,
  mobile = false,
  onNavigate,
}: {
  copy: Dictionary;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav
      className={cn(mobile ? 'grid gap-1' : 'flex items-center gap-1')}
      aria-label={mobile ? 'Mobile navigation' : 'Primary navigation'}
    >
      {navigation.map((item, index) => (
        <a
          key={item.id}
          href={item.href}
          className={cn(
            mobile
              ? 'flex min-h-14 items-center justify-between rounded-lg px-4 text-lg font-medium transition-colors hover:bg-white/[0.06]'
              : 'rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground',
          )}
          onClick={onNavigate}
        >
          <span>{copy.nav[item.id]}</span>
          {mobile ? (
            <span className="font-mono text-sm text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </span>
          ) : null}
        </a>
      ))}
    </nav>
  );
}
