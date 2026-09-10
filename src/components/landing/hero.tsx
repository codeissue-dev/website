import { getTranslations } from "next-intl/server";

import { CircuitLine } from "@/components/decor/circuit-line";
import { ProjectTerminal } from "@/components/decor/project-terminal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

type ProcessStep = { title: string; body: string };
type ProofPoint = { term: string; detail: string };

/**
 * Opening screen.
 *
 * The terminal on the right runs the four real delivery steps from the process
 * copy as log lines rather than a mock interface, so nothing in the hero
 * promises a feature that does not exist. It is decorative; the process
 * section below repeats the same steps as text.
 */
export async function Hero() {
  const [t, process] = await Promise.all([
    getTranslations("Hero"),
    getTranslations("Process"),
  ]);
  const steps = (process.raw("steps") as ProcessStep[]).map((step) => step.title);
  const proof = t.raw("proof") as ProofPoint[];

  return (
    <section aria-labelledby="hero-heading" className="hero-grid">
      <Container className="py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:items-start lg:gap-16">
          <div>
            <p className="section-eyebrow rise">
              <span className="eyebrow-dot text-cyan" />
              {t("eyebrow")}
            </p>
            <h1 id="hero-heading" className="title-hero rise rise-d1 mt-4">
              {t("title")}
            </h1>
            <p className="lede rise rise-d2 mt-5 max-w-xl">{t("body")}</p>
            <div className="rise rise-d3 mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/register" size="lg">
                {t("primaryAction")}
              </ButtonLink>
              <ButtonLink href="/work" variant="secondary" size="lg">
                {t("secondaryAction")}
              </ButtonLink>
            </div>
          </div>
          <div className="rise rise-d3">
            <ProjectTerminal
              title={t("panelTitle")}
              steps={steps}
              prompt={t("prompt")}
            />
            <CircuitLine className="mt-5" />
          </div>
        </div>
        <dl className="hero-points rise rise-d4 mt-14 grid gap-6 border-t border-line pt-8 sm:grid-cols-3 sm:gap-8">
          {proof.map((point) => (
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
