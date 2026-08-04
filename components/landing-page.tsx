'use client';

import { useChangeLanguage } from 'next-i18next/client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import type { Dictionary, Locale } from '@/lib/i18n';
import { contactEmail, domains, navigation, socials } from '@/lib/site-data.js';
import { cn } from '@/lib/utils';

import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CodeIssueMark,
  GlobeIcon,
  MailIcon,
} from './icons';
import { SocialIcon } from './social-icons';
import type { SocialIconName } from './social-icons';
import { Badge } from './ui/badge';
import { buttonVariants } from './ui/button';
import { Card } from './ui/card';

function ExternalLink({
  href,
  className,
  children,
  label,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={className}
    >
      {children}
    </a>
  );
}

function LanguageSwitch({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary;
}) {
  const changeLanguage = useChangeLanguage('codeissue-locale');
  const nextLocale: Locale = locale === 'en' ? 'ru' : 'en';

  return (
    <button
      type="button"
      className="language-switch"
      aria-label={copy.language.switchLabel}
      onClick={() => changeLanguage(nextLocale)}
    >
      <GlobeIcon className="size-4" />
      <span>{nextLocale.toUpperCase()}</span>
    </button>
  );
}

function IssueTicket({ copy }: { copy: Dictionary['hero']['ticket'] }) {
  return (
    <div className="issue-ticket" aria-label={copy.title}>
      <div className="issue-ticket__topline">
        <span className="issue-ticket__id">{copy.id}</span>
        <span className="issue-ticket__status">
          <i aria-hidden="true" />
          {copy.status}
        </span>
      </div>

      <h2>{copy.title}</h2>

      <div className="issue-ticket__io">
        <div>
          <span>{copy.inputLabel}</span>
          <strong>{copy.inputValue}</strong>
        </div>
        <ArrowRightIcon className="size-5" />
        <div>
          <span>{copy.outputLabel}</span>
          <strong>{copy.outputValue}</strong>
        </div>
      </div>

      <ol className="issue-ticket__stages">
        {copy.stages.map((stage, index) => (
          <li
            key={stage}
            className={cn(
              index === 0 && 'is-complete',
              index === 1 && 'is-current',
            )}
          >
            <span className="issue-ticket__stage-mark">
              {index === 0 ? <CheckIcon className="size-3.5" /> : index + 1}
            </span>
            <span>{stage}</span>
          </li>
        ))}
      </ol>

      <div className="issue-ticket__footer">
        <div>
          <span>{copy.ownerLabel}</span>
          <strong>{copy.ownerValue}</strong>
        </div>
        <div>
          <span>{copy.reviewLabel}</span>
          <strong>{copy.reviewValue}</strong>
        </div>
      </div>
    </div>
  );
}

function ProcessPanel({
  copy,
  active,
}: {
  copy: Dictionary['process'];
  active: number;
}) {
  const step = copy.steps[active];

  return (
    <div className="process-panel" key={active}>
      <div className="process-panel__topline">
        <span>{copy.currentLabel}</span>
        <span className="process-panel__status">
          <i aria-hidden="true" />
          {copy.status}
        </span>
      </div>

      <div className="process-panel__number">{step.number}</div>
      <h3>{step.title}</h3>
      <p>{step.copy}</p>

      <div className="process-panel__deliverables">
        <span>{copy.deliverablesLabel}</span>
        <ul>
          {step.deliverables.map((item) => (
            <li key={item}>
              <CheckIcon className="size-4" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="process-panel__progress" aria-hidden="true">
        {copy.steps.map((item, index) => (
          <span
            key={item.number}
            className={index <= active ? 'is-active' : ''}
          />
        ))}
      </div>
    </div>
  );
}

function SocialCard({
  social,
  copy,
}: {
  social: (typeof socials)[number];
  copy: Dictionary['network'];
}) {
  const description =
    copy.socials[social.id as keyof typeof copy.socials] ?? '';
  const style = {
    '--social-accent': social.accent,
  } as CSSProperties;

  return (
    <ExternalLink
      href={social.href}
      className={cn('social-link-card', social.featured && 'is-featured')}
      label={`${social.name}: ${social.handle}`}
    >
      <article style={style}>
        <div className="social-link-card__visual" aria-hidden="true">
          <div className="social-link-card__art-grid" />
          <div className="social-link-card__icon">
            <SocialIcon
              name={social.id as SocialIconName}
              className="size-10 sm:size-12"
            />
          </div>
          <div className="social-link-card__signal">
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="social-link-card__handle">{social.handle}</span>
        </div>

        <div className="social-link-card__body">
          <div>
            <span className="social-link-card__name">{social.name}</span>
            <p>{description}</p>
          </div>
          <span className="social-link-card__open">
            {copy.open}
            <ArrowUpRightIcon className="size-4" />
          </span>
        </div>
      </article>
    </ExternalLink>
  );
}

export function LandingPage({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary;
}) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeProcess, setActiveProcess] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let frame = 0;

    root.lang = locale;

    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = root.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

        progressRef.current?.style.setProperty(
          'transform',
          `scaleX(${progress})`,
        );
        root.style.setProperty('--page-scroll', `${window.scrollY}px`);
      });
    };

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      root.style.setProperty('--pointer-x', `${x}`);
      root.style.setProperty('--pointer-y', `${y}`);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    );

    document
      .querySelectorAll<HTMLElement>('[data-reveal]')
      .forEach((element) => revealObserver.observe(element));

    const processObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveProcess(Number(visible.target.getAttribute('data-step')));
        }
      },
      { threshold: [0.35, 0.6, 0.82], rootMargin: '-24% 0px -35% 0px' },
    );

    document
      .querySelectorAll<HTMLElement>('[data-process-step]')
      .forEach((element) => processObserver.observe(element));

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    if (!reduceMotion) {
      window.addEventListener('pointermove', updatePointer, { passive: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('pointermove', updatePointer);
      revealObserver.disconnect();
      processObserver.disconnect();
    };
  }, [locale]);

  return (
    <div className="site-shell">
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />

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
              {copy.nav[item.id as keyof typeof copy.nav]}
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

      <main>
        <section id="top" className="hero-section">
          <div className="section-frame hero-grid">
            <div className="hero-copy">
              <Badge className="section-label" data-reveal>
                <span className="section-label__dot" aria-hidden="true" />
                {copy.hero.eyebrow}
              </Badge>

              <h1 className="hero-title">
                <span data-reveal>{copy.hero.lineOne}</span>
                <span className="hero-title__accent" data-reveal>
                  {copy.hero.lineTwo}
                </span>
              </h1>

              <p className="hero-description" data-reveal>
                {copy.hero.description}
              </p>

              <div className="hero-actions" data-reveal>
                <a
                  href={`mailto:${contactEmail}`}
                  className={buttonVariants({
                    size: 'lg',
                    className: 'primary-cta',
                  })}
                >
                  {copy.hero.primary}
                  <ArrowUpRightIcon className="size-4" />
                </a>
                <a
                  href="#approach"
                  className={buttonVariants({
                    variant: 'secondary',
                    size: 'lg',
                    className: 'secondary-cta',
                  })}
                >
                  {copy.hero.secondary}
                  <ArrowDownIcon className="size-4" />
                </a>
              </div>

              <div className="hero-domains" data-reveal>
                {domains.map((domain) => (
                  <ExternalLink key={domain.href} href={domain.href}>
                    <span aria-hidden="true" />
                    {domain.label}
                  </ExternalLink>
                ))}
              </div>
            </div>

            <div className="hero-ticket-wrap" data-reveal>
              <div className="hero-ticket-backdrop" aria-hidden="true">
                <span>IDEA</span>
                <span>SYSTEM</span>
                <span>PRODUCT</span>
              </div>
              <IssueTicket copy={copy.hero.ticket} />
            </div>
          </div>

          <a href="#approach" className="scroll-cue">
            <span>{copy.hero.scroll}</span>
            <ArrowDownIcon className="size-4" />
          </a>
        </section>

        <section id="approach" className="approach-section section-pad">
          <div className="section-frame">
            <div className="approach-intro">
              <div>
                <p className="eyebrow" data-reveal>
                  {copy.approach.eyebrow}
                </p>
                <h2 data-reveal>{copy.approach.title}</h2>
              </div>
              <p className="approach-intro__description" data-reveal>
                {copy.approach.description}
              </p>
            </div>

            <div className="principles-grid">
              {copy.approach.principles.map((principle, index) => (
                <Card
                  key={principle.number}
                  className="principle-card"
                  data-reveal
                  style={
                    { '--reveal-delay': `${index * 80}ms` } as CSSProperties
                  }
                >
                  <span className="principle-card__number">
                    {principle.number}
                  </span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.copy}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="process-section section-pad">
          <div className="section-frame process-grid">
            <div className="process-copy">
              <p className="eyebrow" data-reveal>
                {copy.process.eyebrow}
              </p>
              <h2 data-reveal>{copy.process.title}</h2>
              <p className="process-copy__intro" data-reveal>
                {copy.process.description}
              </p>

              <div className="process-steps">
                {copy.process.steps.map((step, index) => (
                  <article
                    key={step.number}
                    className={cn(
                      'process-step',
                      activeProcess === index && 'is-active',
                    )}
                    data-process-step
                    data-step={index}
                  >
                    <span>{step.number}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="process-sticky" data-reveal>
              <ProcessPanel copy={copy.process} active={activeProcess} />
            </div>
          </div>
        </section>

        <section className="services-section section-pad">
          <div className="section-frame">
            <div className="section-heading services-heading">
              <div>
                <p className="eyebrow" data-reveal>
                  {copy.services.eyebrow}
                </p>
                <h2 data-reveal>{copy.services.title}</h2>
              </div>
              <p data-reveal>{copy.services.description}</p>
            </div>

            <div className="services-grid">
              {copy.services.items.map((item, index) => (
                <article
                  key={item.number}
                  className="service-card"
                  data-reveal
                  style={
                    { '--reveal-delay': `${index * 70}ms` } as CSSProperties
                  }
                >
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <div className="service-card__line" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="network" className="network-section section-pad">
          <div className="section-frame">
            <div className="section-heading network-heading">
              <div>
                <p className="eyebrow" data-reveal>
                  {copy.network.eyebrow}
                </p>
                <h2 data-reveal>{copy.network.title}</h2>
              </div>
              <p data-reveal>{copy.network.description}</p>
            </div>

            <div className="social-grid">
              {socials.map((social, index) => (
                <div
                  key={social.id}
                  data-reveal
                  style={
                    {
                      '--reveal-delay': `${(index % 4) * 70}ms`,
                    } as CSSProperties
                  }
                >
                  <SocialCard social={social} copy={copy.network} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section section-pad">
          <div className="section-frame cta-panel" data-reveal>
            <div>
              <p className="eyebrow">{copy.cta.eyebrow}</p>
              <h2>{copy.cta.title}</h2>
              <p>{copy.cta.description}</p>
            </div>
            <div className="cta-panel__actions">
              <a
                href={`mailto:${contactEmail}`}
                className={buttonVariants({
                  size: 'lg',
                  className: 'primary-cta',
                })}
              >
                <MailIcon className="size-4" />
                {copy.cta.primary}
              </a>
              <ExternalLink
                href="https://discord.gg/uckqayVRmy"
                className={buttonVariants({
                  variant: 'secondary',
                  size: 'lg',
                  className: 'secondary-cta',
                })}
              >
                <SocialIcon name="discord" className="size-4" />
                {copy.cta.secondary}
              </ExternalLink>
            </div>
          </div>
        </section>
      </main>

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
    </div>
  );
}
