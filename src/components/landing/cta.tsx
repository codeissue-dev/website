import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="cta-shell relative">
          <div
            aria-hidden="true"
            className="grid-backdrop absolute inset-0 opacity-30"
          />
          <div className="relative px-6 py-12 sm:px-10 sm:py-14">
            <SectionHeading
              id="cta-heading"
              eyebrow="Ready when you are"
              title="Write the brief while the problem is still fresh"
              description="Creating an account takes a moment, and the request form is the same one our engineers read. You will have a project page, a reference and a place to talk to us before the day is out."
            />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/register" size="lg" className="cta-primary">
                Create an account
              </ButtonLink>
              <ButtonLink href="/sign-in" variant="secondary" size="lg">
                I already have one
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
