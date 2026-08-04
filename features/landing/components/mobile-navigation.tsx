import type { Dictionary, Locale } from '@/lib/i18n';
import { pageFrame } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { LanguageSwitch } from './language-switch';
import { SiteHeaderActions } from './site-header-actions';
import { SiteNavLinks } from './site-nav-links';

export function MobileNavigation({
  open,
  locale,
  copy,
  onNavigate,
}: {
  open: boolean;
  locale: Locale;
  copy: Dictionary;
  onNavigate: () => void;
}) {
  return (
    <div
      id="mobile-navigation"
      className={cn(
        'absolute inset-x-0 top-full h-[calc(100dvh-4rem)] border-b border-border bg-black transition-[opacity,visibility,transform] duration-200 lg:hidden',
        open
          ? 'visible translate-y-0 opacity-100'
          : 'invisible -translate-y-2 opacity-0',
      )}
    >
      <div className={cn(pageFrame, 'flex h-full flex-col py-5')}>
        <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
          <span className="text-sm text-muted-foreground">
            {copy.language.label}
          </span>
          <LanguageSwitch locale={locale} label={copy.language.switchLabel} />
        </div>
        <SiteNavLinks copy={copy} mobile onNavigate={onNavigate} />
        <div className="mt-5 border-t border-border pt-5">
          <SiteHeaderActions
            mobile
            locale={locale}
            copy={copy}
            onNavigate={onNavigate}
          />
        </div>
        <div className="mt-auto border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
          <p>codeissue.dev</p>
          <p>codeissue@outlook.com</p>
        </div>
      </div>
    </div>
  );
}
