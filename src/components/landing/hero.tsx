import { HeroConsole } from "@/components/landing/hero-console";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { HERO, HERO_PROOF } from "@/content/landing";

/**
 * The opening panel: a short promise, two clear actions and an illustration of
 * the project space. All motion is decorative and disabled for visitors who ask
 * for reduced motion.
 */
export function Hero() {
  return (
    <section className="hero-shell relative overflow-hidden">
      <div aria-hidden="true" className="hero-stars absolute inset-0" />
      <div aria-hidden="true" className="hero-aurora" />
      <div aria-hidden="true" className="hero-orbit hero-orbit-one" />
      <div aria-hidden="true" className="hero-orbit hero-orbit-two" />

      <Container className="relative z-10 pb-16 pt-20 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="hero-intro stagger-list">
          <p className="section-eyebrow">{HERO.eyebrow}</p>
          <h1 className="hero-title mt-4">
            {HERO.heading.lead}{" "}
            <span className="hero-gradient">{HERO.heading.accent}</span>
          </h1>
          <p className="hero-copy mt-6">{HERO.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={HERO.primaryAction.href} size="lg">
              {HERO.primaryAction.label}
            </ButtonLink>
            <ButtonLink href={HERO.secondaryAction.href} variant="secondary" size="lg">
              {HERO.secondaryAction.label}
            </ButtonLink>
          </div>
        </div>

        <HeroConsole />

        <dl className="hero-proof stagger-grid mt-10 grid gap-px overflow-hidden rounded-panel border border-line sm:mt-12 sm:grid-cols-3">
          {HERO_PROOF.map((point) => (
            <div key={point.term}>
              <dt>{point.term}</dt>
              <dd>{point.detail}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
