import { ButtonLink } from "@/components/ui/button";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/orders/status";

const CONSOLE_NAV = ["Overview", "Brief", "Conversation", "Delivery"];

/**
 * The opening panel mirrors the actual delivery flow instead of inventing a
 * generic dashboard. Its motion is decorative and respects reduced-motion
 * preferences in the global stylesheet.
 */
export function Hero() {
  return (
    <section className="hero-shell relative overflow-hidden">
      <div aria-hidden="true" className="hero-stars absolute inset-0" />
      <div aria-hidden="true" className="hero-aurora" />
      <div aria-hidden="true" className="hero-orbit hero-orbit-one" />
      <div aria-hidden="true" className="hero-orbit hero-orbit-two" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="hero-intro stagger-list">
          <p className="section-eyebrow">Software for work that is ready to move</p>
          <h1 className="hero-title mt-4">
            Build the product that{" "}
            <span className="hero-gradient">keeps work moving.</span>
          </h1>
          <p className="hero-copy mt-6">
            Bring the process that needs fixing. We turn it into focused software and
            keep the project clear from the first brief to the handover.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/register" size="lg">
              Start a project
            </ButtonLink>
            <ButtonLink href="/work" variant="secondary" size="lg">
              Browse public projects
            </ButtonLink>
          </div>
        </div>

        <div aria-hidden="true" className="hero-console mt-14 sm:mt-16">
          <div className="console-toolbar">
            <div className="flex items-center gap-1.5">
              <span className="console-dot console-dot-rose" />
              <span className="console-dot console-dot-gold" />
              <span className="console-dot console-dot-mint" />
            </div>
            <span className="console-toolbar-title">project space</span>
            <span className="console-live">
              <span className="console-live-dot" /> Live
            </span>
          </div>

          <div className="console-layout">
            <aside className="console-sidebar">
              <span className="console-sidebar-label">Workspace</span>
              <div className="mt-3 flex flex-col gap-1">
                {CONSOLE_NAV.map((item, index) => (
                  <span
                    key={item}
                    className={
                      index === 0 ? "console-nav-item is-active" : "console-nav-item"
                    }
                  >
                    <span className="console-nav-mark" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="console-sidebar-note">
                <span className="console-pulse" />
                Everything in one thread
              </div>
            </aside>

            <div className="console-main">
              <div className="console-breadcrumb">New request / Product workspace</div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="console-kicker">Project brief</p>
                  <p className="console-project-title">A better home for the work</p>
                </div>
                <span className="console-status">In progress</span>
              </div>

              <div className="console-summary-grid mt-6">
                <div className="console-summary-card">
                  <span>Scope</span>
                  <strong>Confirmed</strong>
                </div>
                <div className="console-summary-card">
                  <span>Next step</span>
                  <strong>Build review</strong>
                </div>
                <div className="console-summary-card">
                  <span>Updates</span>
                  <strong>In the thread</strong>
                </div>
              </div>

              <div className="console-progress-panel mt-5">
                <div className="flex items-center justify-between gap-3">
                  <span>Delivery progress</span>
                  <span>72%</span>
                </div>
                <span className="console-progress-track mt-3">
                  <span className="console-progress-fill console-progress-main" />
                </span>
                <div className="console-tick-row mt-3">
                  <span>Brief</span>
                  <span>Scope</span>
                  <span>Build</span>
                  <span>Review</span>
                </div>
              </div>
            </div>

            <aside className="console-activity">
              <p className="console-sidebar-label">Recent activity</p>
              <div className="mt-4 flex flex-col gap-4">
                <div className="console-activity-item">
                  <span className="console-activity-dot is-blue" />
                  <span>Scope approved</span>
                </div>
                <div className="console-activity-item">
                  <span className="console-activity-dot is-violet" />
                  <span>Build started</span>
                </div>
                <div className="console-activity-item">
                  <span className="console-activity-dot is-mint" />
                  <span>Update posted</span>
                </div>
              </div>
              <div className="console-message mt-7">
                <span className="console-message-avatar" />
                <div>
                  <span className="console-message-name">Project update</span>
                  <span className="console-message-line" />
                  <span className="console-message-line is-short" />
                </div>
              </div>
            </aside>
          </div>

          <div className="console-footer">
            <span className="console-footer-label">The path stays visible</span>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {ORDER_STATUSES.map((status, index) => (
                <span key={status} className="console-flow-step">
                  {index > 0 ? <i>/</i> : null}
                  {ORDER_STATUS_LABELS[status]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <dl className="hero-proof stagger-grid mt-10 grid gap-px overflow-hidden rounded-panel border border-line sm:mt-12 sm:grid-cols-3">
          <div>
            <dt>One written brief</dt>
            <dd>A clear place to explain the problem before anyone starts building.</dd>
          </div>
          <div>
            <dt>Visible progress</dt>
            <dd>Every stage and update is part of the same project record.</dd>
          </div>
          <div>
            <dt>Useful handover</dt>
            <dd>The result, source and context remain accessible after delivery.</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
