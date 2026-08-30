import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function Cta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="public-section border-b border-line"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="cta-shell relative">
          <div aria-hidden="true" className="cta-grid absolute inset-0" />
          <div aria-hidden="true" className="cta-halo cta-halo-one" />
          <div aria-hidden="true" className="cta-halo cta-halo-two" />
          <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <SectionHeading
              id="cta-heading"
              eyebrow="Start with the work you have"
              title={
                <>
                  Give the next project{" "}
                  <span className="cta-title-accent">a clear place to start.</span>
                </>
              }
              description="Open an account, write the brief and keep the conversation next to the work from day one."
            />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/register" size="lg" className="cta-primary">
                Open a project
              </ButtonLink>
              <ButtonLink
                href="/sign-in"
                variant="secondary"
                size="lg"
                className="cta-secondary"
              >
                Sign in
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
