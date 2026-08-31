import type { CSSProperties } from "react";

import { HERO_CONSOLE, type ConsoleActivityTone } from "@/content/landing";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/orders/status";

const TONE_CLASS: Record<ConsoleActivityTone, string> = {
  blue: "is-blue",
  violet: "is-violet",
  mint: "is-mint",
};

const progressStyle: CSSProperties = {
  width: `${HERO_CONSOLE.progress.percent}%`,
};

/**
 * An illustration of the project space, not a live view.
 *
 * It is hidden from assistive technology because the same information is
 * available as real text elsewhere on the page. The delivery stages come from
 * the platform's status machine, so the picture cannot drift from the product.
 */
export function HeroConsole() {
  return (
    <div aria-hidden="true" className="hero-console mt-14 sm:mt-16">
      <div className="console-toolbar">
        <div className="flex items-center gap-1.5">
          <span className="console-dot console-dot-rose" />
          <span className="console-dot console-dot-gold" />
          <span className="console-dot console-dot-mint" />
        </div>
        <span className="console-toolbar-title">{HERO_CONSOLE.title}</span>
        <span className="console-live">
          <span className="console-live-dot" /> {HERO_CONSOLE.liveLabel}
        </span>
      </div>

      <div className="console-layout">
        <aside className="console-sidebar">
          <span className="console-sidebar-label">Workspace</span>
          <div className="mt-3 flex flex-col gap-1">
            {HERO_CONSOLE.nav.map((item, index) => (
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
            {HERO_CONSOLE.navNote}
          </div>
        </aside>

        <div className="console-main">
          <div className="console-breadcrumb">{HERO_CONSOLE.breadcrumb}</div>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="console-kicker">{HERO_CONSOLE.kicker}</p>
              <p className="console-project-title">{HERO_CONSOLE.projectTitle}</p>
            </div>
            <span className="console-status">{HERO_CONSOLE.status}</span>
          </div>

          <div className="console-summary-grid mt-6">
            {HERO_CONSOLE.summary.map((card) => (
              <div key={card.label} className="console-summary-card">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="console-progress-panel mt-5">
            <div className="flex items-center justify-between gap-3">
              <span>{HERO_CONSOLE.progress.label}</span>
              <span>{HERO_CONSOLE.progress.percent}%</span>
            </div>
            <span className="console-progress-track mt-3">
              <span
                className="console-progress-fill console-progress-main"
                style={progressStyle}
              />
            </span>
            <div className="console-tick-row mt-3">
              {HERO_CONSOLE.progress.ticks.map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
          </div>
        </div>

        <aside className="console-activity">
          <p className="console-sidebar-label">{HERO_CONSOLE.activityTitle}</p>
          <div className="mt-4 flex flex-col gap-4">
            {HERO_CONSOLE.activity.map((entry) => (
              <div key={entry.label} className="console-activity-item">
                <span className={`console-activity-dot ${TONE_CLASS[entry.tone]}`} />
                <span>{entry.label}</span>
              </div>
            ))}
          </div>
          <div className="console-message mt-7">
            <span className="console-message-avatar" />
            <div>
              <span className="console-message-name">{HERO_CONSOLE.messageTitle}</span>
              <span className="console-message-line" />
              <span className="console-message-line is-short" />
            </div>
          </div>
        </aside>
      </div>

      <div className="console-footer">
        <span className="console-footer-label">{HERO_CONSOLE.footerLabel}</span>
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
  );
}
