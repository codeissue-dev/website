'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';

import {
  capabilities,
  contactEmail,
  domains,
  navigation,
  principles,
  socials,
} from '@/lib/site-data.js';
import { cn } from '@/lib/utils';

import { Badge } from './ui/badge';
import { buttonVariants } from './ui/button';
import { Card } from './ui/card';
import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  CodeIssueMark,
  MailIcon,
  SparkIcon,
} from './icons';

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

function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual__halo" />
      <div className="hero-visual__orbit hero-visual__orbit--one">
        <span>BUILD</span>
        <span>BREAK</span>
        <span>SHIP</span>
      </div>
      <div className="hero-visual__orbit hero-visual__orbit--two" />
      <div className="hero-visual__core">
        <div className="hero-visual__scan" />
        <CodeIssueMark className="size-20 text-white sm:size-28" />
        <span className="hero-visual__core-label">CODEISSUE</span>
      </div>
      <div className="hero-visual__node hero-visual__node--a">01</div>
      <div className="hero-visual__node hero-visual__node--b">CI</div>
      <div className="hero-visual__node hero-visual__node--c">DEV</div>
    </div>
  );
}

function TerminalPanel({ active }: { active: number }) {
  const commands = [
    ['scope', 'understand the real problem'],
    ['probe', 'stress every assumption'],
    ['release', 'ship the strongest signal'],
  ];

  return (
    <div className="terminal-panel">
      <div className="terminal-panel__bar">
        <span />
        <span />
        <span />
        <p>codeissue / operating-system</p>
      </div>
      <div className="terminal-panel__body">
        <div className="terminal-panel__meta">
          <span>STATUS</span>
          <strong>ONLINE</strong>
        </div>
        <div className="terminal-panel__command" key={active}>
          <span className="text-primary">$</span>
          <span>codeissue {commands[active][0]}</span>
          <span className="terminal-panel__cursor" />
        </div>
        <p className="terminal-panel__output">{commands[active][1]}</p>
        <div className="terminal-panel__graph">
          {Array.from({ length: 22 }).map((_, index) => (
            <span
              key={index}
              style={{
                height: `${18 + ((index * 17 + active * 29) % 72)}%`,
                animationDelay: `${index * -0.06}s`,
              }}
            />
          ))}
        </div>
        <div className="terminal-panel__footer">
          <span>signal integrity</span>
          <span>{97 + active}%</span>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const progressRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [activePrinciple, setActivePrinciple] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let frame = 0;

    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - innerHeight;
        const progress = scrollable > 0 ? scrollY / scrollable : 0;
        progressRef.current?.style.setProperty(
          'transform',
          `scaleX(${progress})`,
        );
        root.style.setProperty('--grid-scroll', `${scrollY * -0.018}px`);
        root.style.setProperty('--orb-scroll', `${scrollY * -0.025}px`);
        root.style.setProperty('--code-scroll', `${scrollY * -0.012}px`);
      });
    };

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      const x = event.clientX / innerWidth - 0.5;
      const y = event.clientY / innerHeight - 0.5;
      root.style.setProperty('--hero-shift-x', `${x * 50}px`);
      root.style.setProperty('--hero-shift-y', `${y * 30}px`);
      root.style.setProperty('--hero-rotate-x', `${y * -8}deg`);
      root.style.setProperty('--hero-rotate-y', `${x * 10}deg`);
      cursorRef.current?.style.setProperty(
        'transform',
        `translate3d(${event.clientX}px, ${event.clientY}px, 0)`,
      );
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
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    document
      .querySelectorAll<HTMLElement>('[data-reveal]')
      .forEach((element) => revealObserver.observe(element));

    const stepObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActivePrinciple(Number(visible.target.getAttribute('data-step')));
        }
      },
      { threshold: [0.35, 0.6, 0.8], rootMargin: '-28% 0px -28% 0px' },
    );

    document
      .querySelectorAll<HTMLElement>('[data-process-step]')
      .forEach((element) => stepObserver.observe(element));

    updateScroll();
    addEventListener('scroll', updateScroll, { passive: true });

    if (!reduceMotion) {
      addEventListener('pointermove', updatePointer, { passive: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', updateScroll);
      removeEventListener('pointermove', updatePointer);
      revealObserver.disconnect();
      stepObserver.disconnect();
    };
  }, []);

  const handleTilt = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty('--tilt-x', `${x * 10}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${y * -10}deg`);
    event.currentTarget.style.setProperty('--glow-x', `${(x + 0.5) * 100}%`);
    event.currentTarget.style.setProperty('--glow-y', `${(y + 0.5) * 100}%`);
  };

  const resetTilt = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div className="site-shell">
      <div className="scroll-progress" ref={progressRef} />
      <div className="cursor-glow" ref={cursorRef} aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />

      <header className="site-header">
        <a href="#top" className="brand" aria-label="Codeissue home">
          <span className="brand__mark">
            <CodeIssueMark className="size-6" />
          </span>
          <span className="brand__word">codeissue</span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <ExternalLink
          href="https://discord.gg/uckqayVRmy"
          className="header-status"
          label="Join Codeissue on Discord"
        >
          <span className="status-dot" />
          Community online
        </ExternalLink>
      </header>

      <main>
        <section id="top" className="hero-section section-frame">
          <div className="hero-copy">
            <Badge className="hero-badge" data-reveal>
              <span className="status-dot" />
              Independent developer network
            </Badge>

            <h1
              className="hero-title"
              aria-label="Code the future. Fix the impossible."
            >
              <span className="hero-title__line" data-reveal>
                Code the future.
              </span>
              <span
                className="hero-title__line hero-title__line--accent"
                data-reveal
              >
                Fix the impossible.
              </span>
            </h1>

            <p className="hero-description" data-reveal>
              Codeissue is a digital lab and community for people who build,
              break, debug, and ship what comes next.
            </p>

            <div className="hero-actions" data-reveal>
              <ExternalLink
                href="https://discord.gg/uckqayVRmy"
                className={buttonVariants({ size: 'lg' })}
              >
                Enter the community
                <ArrowUpRightIcon className="size-4" />
              </ExternalLink>
              <ExternalLink
                href="https://github.com/codeissue-dev"
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                Explore GitHub
                <span className="font-mono text-xs text-white/45">GH</span>
              </ExternalLink>
            </div>

            <div className="hero-domains" data-reveal>
              {domains.map((domain) => (
                <ExternalLink key={domain.href} href={domain.href}>
                  <span className="status-dot status-dot--muted" />
                  {domain.label}
                </ExternalLink>
              ))}
            </div>
          </div>

          <div className="hero-art" data-reveal>
            <HeroVisual />
          </div>

          <a
            href="#manifesto"
            className="scroll-cue"
            aria-label="Scroll to manifesto"
          >
            <span>Scroll to decode</span>
            <ArrowDownIcon className="size-4" />
          </a>
        </section>

        <section className="signal-strip" aria-label="Codeissue principles">
          <div className="signal-strip__track">
            {[0, 1].map((row) => (
              <div key={row} aria-hidden={row === 1}>
                <span>BUILD WITH INTENT</span>
                <SparkIcon />
                <span>BREAK THE OBVIOUS</span>
                <SparkIcon />
                <span>SHIP THE SIGNAL</span>
                <SparkIcon />
              </div>
            ))}
          </div>
        </section>

        <section id="manifesto" className="manifesto-section section-frame">
          <div className="section-kicker" data-reveal>
            <span>01</span>
            <p>The manifesto</p>
          </div>

          <div className="manifesto-heading">
            <h2 data-reveal>
              Not another content feed.
              <span>A place to make the internet useful again.</span>
            </h2>
            <p data-reveal>
              We care about the invisible work: the reasoning behind the code,
              the failed version before the elegant one, and the community that
              makes every next attempt stronger.
            </p>
          </div>

          <div className="manifesto-grid">
            <div className="manifesto-steps">
              {principles.map((principle, index) => (
                <article
                  key={principle.index}
                  data-process-step
                  data-step={index}
                  className={cn(
                    'manifesto-step',
                    activePrinciple === index && 'is-active',
                  )}
                >
                  <span>{principle.index}</span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.copy}</p>
                    <code>{principle.code}</code>
                  </div>
                </article>
              ))}
            </div>

            <div className="manifesto-sticky" data-reveal>
              <TerminalPanel active={activePrinciple} />
            </div>
          </div>
        </section>

        <section id="stack" className="capabilities-section section-frame">
          <div className="section-kicker" data-reveal>
            <span>02</span>
            <p>The stack</p>
          </div>

          <div className="section-heading" data-reveal>
            <h2>One signal. Three frequencies.</h2>
            <p>
              The project connects practical engineering, open knowledge, and a
              community that refuses to gatekeep the useful parts.
            </p>
          </div>

          <div className="capability-grid">
            {capabilities.map((capability) => (
              <Card
                key={capability.number}
                className="tilt-card capability-card"
                data-reveal
                onPointerMove={handleTilt}
                onPointerLeave={resetTilt}
              >
                <div className="tilt-card__glow" aria-hidden="true" />
                <div className="capability-card__top">
                  <span>{capability.number}</span>
                  <ArrowUpRightIcon className="size-5" />
                </div>
                <div className="capability-card__body">
                  <p className="capability-card__eyebrow">
                    {capability.eyebrow}
                  </p>
                  <h3>{capability.title}</h3>
                  <p>{capability.copy}</p>
                </div>
                <div className="capability-card__tags">
                  {capability.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="statement-section section-frame">
          <div className="statement-orb" aria-hidden="true" />
          <div className="statement-copy" data-reveal>
            <span>THE CORE IDEA</span>
            <h2>
              Every issue contains
              <em>the next version.</em>
            </h2>
            <p>
              Bugs are compressed understanding. Questions are unfinished tools.
              The work is learning how to turn both into leverage.
            </p>
          </div>
          <div className="statement-code" data-reveal aria-hidden="true">
            <span>while (curious) {'{'}</span>
            <span>&nbsp;&nbsp;inspect();</span>
            <span>&nbsp;&nbsp;iterate();</span>
            <span>&nbsp;&nbsp;share();</span>
            <span>{'}'}</span>
          </div>
        </section>

        <section id="network" className="network-section section-frame">
          <div className="section-kicker" data-reveal>
            <span>03</span>
            <p>The network</p>
          </div>

          <div className="section-heading network-heading" data-reveal>
            <h2>Find the frequency that fits.</h2>
            <p>
              Follow the signal anywhere, or start with Discord and GitHub for
              the full project pulse.
            </p>
          </div>

          <div className="social-grid">
            {socials.map((social, index) => (
              <ExternalLink
                key={social.href}
                href={social.href}
                className={cn(
                  'social-card',
                  social.featured && 'social-card--featured',
                )}
                label={`Open Codeissue on ${social.name}`}
              >
                <div className="social-card__index">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="social-card__mark">{social.mark}</div>
                <div className="social-card__copy">
                  <span>{social.name}</span>
                  <strong>{social.handle}</strong>
                  <p>{social.copy}</p>
                </div>
                <ArrowUpRightIcon className="social-card__arrow" />
              </ExternalLink>
            ))}
          </div>
        </section>

        <section className="cta-section section-frame">
          <div className="cta-panel" data-reveal>
            <div className="cta-panel__signal" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <Badge>
              <span className="status-dot" />
              Open channel
            </Badge>
            <h2>Have an issue worth solving?</h2>
            <p>
              Bring the difficult problem, the strange idea, or the unfinished
              experiment. That is usually where the interesting work begins.
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className={buttonVariants({
                size: 'lg',
                className: 'cta-button',
              })}
            >
              <MailIcon className="size-4" />
              {contactEmail}
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer section-frame">
        <a href="#top" className="brand" aria-label="Back to top">
          <span className="brand__mark">
            <CodeIssueMark className="size-6" />
          </span>
          <span className="brand__word">codeissue</span>
        </a>
        <p>Build carefully. Debug honestly. Share the signal.</p>
        <div>
          <span>© 2026</span>
          <a href={`mailto:${contactEmail}`}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
