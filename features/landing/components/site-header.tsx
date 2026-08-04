import Link from 'next/link';

import { ArrowUpRightIcon, CodeIssueMark } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary, Locale } from '@/lib/i18n';
import { contactEmail, navigation } from '@/lib/site-data';

import { LanguageSwitch } from './language-switch';

export function SiteHeader({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary;
}) {
  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="Codeissue">
        <span className="brand__mark">
          <CodeIssueMark className="size-5" />
        </span>
        <span className="brand__copy">
          <strong>Codeissue</strong>
          <small>{copy.brand.descriptor}</small>
        </span>
      </a>

      <nav className="site-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <a key={item.id} href={item.href}>
            {copy.nav[item.id]}
          </a>
        ))}
      </nav>

      <div className="site-header__actions">
        <LanguageSwitch locale={locale} copy={copy} />
        <Link
          href="/admin"
          className={buttonVariants({
            variant: 'secondary',
            size: 'sm',
            className: 'header-workspace',
          })}
        >
          {copy.nav.workspace}
        </Link>
        <a
          href={`mailto:${contactEmail}`}
          className={buttonVariants({
            size: 'sm',
            className: 'header-contact',
          })}
        >
          {copy.nav.contact}
          <ArrowUpRightIcon className="size-4" />
        </a>
      </div>
    </header>
  );
}
