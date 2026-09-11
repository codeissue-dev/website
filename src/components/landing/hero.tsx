import { getTranslations } from "next-intl/server";

import { CircuitLine } from "@/components/decor/circuit-line";
import { Console } from "@/components/decor/console";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icon";
import { Container } from "@/components/ui/section";

type ProofPoint = { term: string; detail: string };

/**
 * Opening screen.
 *
 * The console on the right is a working terminal: its commands scroll to the
 * sections below, open the brief form and flip the same theme and language
 * preferences the header sets. It is a real control, so it stays reachable.
 */
export async function Hero() {
  const t = await getTranslations("Hero");
  const proof = t.raw("proof") as ProofPoint[];

  return (
    <section aria-labelledby="hero-heading" className="hero-grid">
      <Container className="py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:items-start lg:gap-16">
          <div>
            <h1 id="hero-heading" className="title-hero rise">
              {t("title")}
            </h1>
            <p className="lede rise rise-d1 mt-5 max-w-xl">{t("body")}</p>
            <div className="rise rise-d2 mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/register" size="lg">
                {t("primaryAction")}
                <ArrowRightIcon />
              </ButtonLink>
              <ButtonLink href="/work" variant="secondary" size="lg">
                {t("secondaryAction")}
              </ButtonLink>
            </div>
          </div>
          <div className="rise rise-d2">
            <Console />
            <CircuitLine className="mt-5" />
          </div>
        </div>
        <dl className="hero-points rise rise-d3 mt-14 grid gap-6 border-t border-line pt-8 sm:grid-cols-3 sm:gap-8">
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
