import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ChevronDown,
  ExternalLink,
  Moon,
  Package,
  Settings,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Terminal,
  type LucideProps,
} from "lucide-react";

/**
 * One icon family for the whole product: lucide glyphs at 16px with a 1.5px
 * stroke, inheriting `currentColor`. Icons only repeat what the neighbouring
 * text already says, so most are hidden from assistive technology.
 */
function withDefaults(props: LucideProps): LucideProps {
  return {
    size: 16,
    strokeWidth: 1.5,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export function ArrowLeftIcon(props: LucideProps) {
  return <ArrowLeft {...withDefaults(props)} />;
}

export function ArrowRightIcon(props: LucideProps) {
  return <ArrowRight {...withDefaults(props)} />;
}

export function ChevronDownIcon(props: LucideProps) {
  return <ChevronDown {...withDefaults(props)} />;
}

export function ExternalLinkIcon(props: LucideProps) {
  return <ExternalLink {...withDefaults(props)} />;
}

export function SunIcon(props: LucideProps) {
  return <Sun {...withDefaults(props)} />;
}

export function MoonIcon(props: LucideProps) {
  return <Moon {...withDefaults(props)} />;
}

export function TerminalIcon(props: LucideProps) {
  return <Terminal {...withDefaults(props)} />;
}

export function SettingsIcon(props: LucideProps) {
  return <Settings {...withDefaults(props)} />;
}

/* Capability glyphs: one per kind of work on the landing page. */

export function SlidersIcon(props: LucideProps) {
  return <SlidersHorizontal {...withDefaults(props)} />;
}

export function WindowIcon(props: LucideProps) {
  return <AppWindow {...withDefaults(props)} />;
}

export function NodesIcon(props: LucideProps) {
  return <Share2 {...withDefaults(props)} />;
}

export function ChartIcon(props: LucideProps) {
  return <BarChart3 {...withDefaults(props)} />;
}

export function ShieldIcon(props: LucideProps) {
  return <ShieldCheck {...withDefaults(props)} />;
}

export function PackageIcon(props: LucideProps) {
  return <Package {...withDefaults(props)} />;
}
