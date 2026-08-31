import { ButtonLink } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Container } from "@/components/ui/section";
import { HERO, HERO_PROOF, PROCESS_STEPS } from "@/content/landing";
import { numberLabel } from "@/lib/utils";

/**
 * Opening screen.
 *
 * The panel on the right lists the four real delivery steps from the process
 * copy rather than a mock interface, so nothing in the hero promises a feature
 * that does not exist.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      <Container className="py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-start lg:gap-16">
          <div>
            <p className="section-eyebrow">{HERO.eyebrow}</p>
            <h1 id="hero-heading" className="title-hero mt-4">
              {HERO.title}
            </h1>
            <p className="lede mt-5 max-w-xl">{HERO.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={HERO.primaryAction.href} size="lg">
                {HERO.primaryAction.label}
              </ButtonLink>
              <ButtonLink
                href={HERO.secondaryAction.href}
                variant="secondary"
                size="lg"
              >
                {HERO.secondaryAction.label}
              </ButtonLink>
            </div>
          </div>
          <Panel as="aside">
            <PanelHeader title={HERO.panelTitle} />
            <ol className="divide-y divide-line">
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.title} className="data-row">
                  <span>{step.title}</span>
                  <span>{numberLabel(index)}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
        <dl className="hero-points mt-14 grid gap-6 border-t border-line pt-8 sm:grid-cols-3 sm:gap-8">
          {HERO_PROOF.map((point) => (
            <div key={point.term}>
              <dt>
                <strong>{point.term}</strong>
              </dt>
              <dd className="mt-1 leading-relaxed">{point.detail}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
