import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { CTA_SECTION } from "@/content/landing";

export function Cta() {
  return (
    <Section labelledBy="cta-heading">
      <div className="cta-band">
        <p className="section-eyebrow">{CTA_SECTION.eyebrow}</p>
        <h2 id="cta-heading" className="section-title max-w-2xl">
          {CTA_SECTION.title}
        </h2>
        <p className="section-description">{CTA_SECTION.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={CTA_SECTION.primaryAction.href} size="lg">
            {CTA_SECTION.primaryAction.label}
          </ButtonLink>
          <ButtonLink
            href={CTA_SECTION.secondaryAction.href}
            variant="secondary"
            size="lg"
          >
            {CTA_SECTION.secondaryAction.label}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
