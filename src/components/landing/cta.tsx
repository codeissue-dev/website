import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTA_SECTION } from "@/content/landing";

export function Cta() {
  return (
    <Section labelledBy="cta-heading">
      <div className="cta-shell relative">
        <div aria-hidden="true" className="cta-grid absolute inset-0" />
        <div aria-hidden="true" className="cta-halo cta-halo-one" />
        <div aria-hidden="true" className="cta-halo cta-halo-two" />
        <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <SectionHeading
            id="cta-heading"
            eyebrow={CTA_SECTION.eyebrow}
            heading={CTA_SECTION.heading}
            accentClassName="cta-title-accent"
            description={CTA_SECTION.description}
          />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={CTA_SECTION.primaryAction.href}
              size="lg"
              className="cta-primary"
            >
              {CTA_SECTION.primaryAction.label}
            </ButtonLink>
            <ButtonLink
              href={CTA_SECTION.secondaryAction.href}
              variant="secondary"
              size="lg"
              className="cta-secondary"
            >
              {CTA_SECTION.secondaryAction.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
