import Link from 'next/link';

import { ArrowUpRightIcon } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary, Locale } from '@/lib/i18n';

import { LanguageSwitch } from './language-switch';

export function SiteHeaderActions({
  locale,
  copy,
  onNavigate,
  mobile = false,
}: {
  locale: Locale;
  copy: Dictionary;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  return (
    <div
      className={
        mobile ? 'grid gap-2 sm:grid-cols-2' : 'flex items-center gap-2'
      }
    >
      {mobile ? null : (
        <LanguageSwitch locale={locale} label={copy.language.switchLabel} />
      )}
      <Link
        href="/account"
        className={buttonVariants({
          variant: mobile ? 'secondary' : 'ghost',
          size: mobile ? 'lg' : 'sm',
        })}
        onClick={onNavigate}
      >
        {copy.nav.workspace}
      </Link>
      <Link
        href="/issues/new"
        className={buttonVariants({ size: mobile ? 'lg' : 'sm' })}
        onClick={onNavigate}
      >
        {copy.nav.contact}
        <ArrowUpRightIcon className={mobile ? 'size-4' : 'size-3.5'} />
      </Link>
    </div>
  );
}
