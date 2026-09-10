import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  ChartIcon,
  NodesIcon,
  PackageIcon,
  ShieldIcon,
  SlidersIcon,
  WindowIcon,
} from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type Capability = { title: string; body: string };

/* Literal utility classes so Tailwind can see them. */
const ICONS = [SlidersIcon, WindowIcon, NodesIcon, ChartIcon, ShieldIcon, PackageIcon];
const TONES = [
  "text-accent",
  "text-cyan",
  "text-violet",
  "text-amber",
  "text-pink",
  "text-positive",
] as const;

/** A definition list, so the six kinds of work read as a list rather than six boxes. */
export async function Capabilities() {
  const t = await getTranslations("Capabilities");
  const items = t.raw("items") as Capability[];

  return (
    <Section id="capabilities" labelledBy="capabilities-heading">
      <SectionHeading
        id="capabilities-heading"
        eyebrow={t("eyebrow")}
        eyebrowTone="cyan"
        title={t("title")}
        description={t("description")}
      />
      <Reveal className="mt-10">
        <dl>
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length] ?? SlidersIcon;
            return (
              <div key={item.title} className="capability-row">
                <dt>
                  <span
                    className={cn(
                      "capability-icon",
                      TONES[index % TONES.length] ?? "text-accent",
                    )}
                  >
                    <Icon />
                  </span>
                  {item.title}
                </dt>
                <dd>{item.body}</dd>
              </div>
            );
          })}
        </dl>
      </Reveal>
    </Section>
  );
}
