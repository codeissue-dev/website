import { CodeIssueMark } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { contactEmail, domains } from '@/lib/site-data';

import { ExternalLink } from './external-link';

export function SiteFooter({ copy }: { copy: Dictionary }) {
  return (
    <footer className="site-footer">
      <div className="section-frame site-footer__grid">
        <div className="site-footer__brand">
          <span className="brand__mark">
            <CodeIssueMark className="size-5" />
          </span>
          <div>
            <strong>Codeissue</strong>
            <span>{copy.footer.rights}</span>
          </div>
        </div>

        <p>{copy.footer.note}</p>

        <div className="site-footer__links">
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          {domains.map((domain) => (
            <ExternalLink key={domain.href} href={domain.href}>
              {domain.label}
            </ExternalLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
