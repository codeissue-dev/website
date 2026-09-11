"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { TerminalIcon } from "@/components/ui/icon";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type Line = { tone: "boot" | "cmd" | "out" | "ok" | "err"; text: string };

const COMMANDS = [
  "help",
  "about",
  "services",
  "process",
  "work",
  "faq",
  "start",
  "signin",
  "theme",
  "lang",
  "top",
  "clear",
] as const;

type Command = (typeof COMMANDS)[number];

const SCROLL_TARGETS: Partial<Record<Command, string>> = {
  services: "capabilities",
  process: "process",
  work: "work",
  faq: "faq",
};

/** Commands are written with a leading slash; the bare word also works. */
function parseCommand(raw: string): { name: string; echoed: string } {
  const trimmed = raw.trim();
  const slashed = trimmed.startsWith("/");
  return {
    name: (slashed ? trimmed.slice(1) : trimmed).trim().toLowerCase(),
    echoed: slashed ? trimmed : `/${trimmed}`,
  };
}

/**
 * A working console for the opening screen.
 *
 * The commands mirror the site: they scroll to sections, open the brief form
 * and flip the same theme and locale preferences the header controls set. The
 * output is a polite live region; the input keeps its own history.
 */
export function Console() {
  const t = useTranslations("Console");
  const tMeta = useTranslations("Meta");
  const locale = useLocale();
  const router = useRouter();

  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLines((t.raw("boot") as string[]).map((text) => ({ tone: "boot", text })));
  }, [locale, t]);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [lines]);

  function push(line: Line) {
    setLines((current) => [...current.slice(-40), line]);
  }

  function run(raw: string) {
    const { name: command, echoed } = parseCommand(raw);
    push({ tone: "cmd", text: echoed });

    if (command === "") return;

    setHistory((current) => [...current, echoed]);
    setHistoryIndex(null);

    if (command === "help") {
      for (const name of COMMANDS) {
        push({
          tone: "out",
          text: `/${name} ${t(`commands.${name}`)}`,
        });
      }
      return;
    }

    if (command === "about") {
      push({ tone: "out", text: tMeta("description") });
      return;
    }

    if (command === "clear") {
      setLines([]);
      return;
    }

    if (command === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      push({ tone: "ok", text: t("jump") });
      return;
    }

    if (command === "start" || command === "signin") {
      push({ tone: "ok", text: t("opening") });
      router.push(command === "start" ? "/register" : "/sign-in");
      return;
    }

    if (command === "theme") {
      const root = document.documentElement;
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        // Storage can be unavailable; the switch still applies.
      }
      push({ tone: "ok", text: next === "light" ? t("themeLight") : t("themeDark") });
      return;
    }

    if (command === "lang") {
      const next: Locale = locale === "en" ? "ru" : "en";
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      push({ tone: "ok", text: next === "ru" ? t("langRu") : t("langEn") });
      router.refresh();
      return;
    }

    const target = SCROLL_TARGETS[command as Command];
    if (target) {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      push({ tone: "ok", text: t("jump") });
      return;
    }

    push({ tone: "err", text: t("hint") });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    run(value);
    setValue("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (history.length === 0) return;

    let index = historyIndex;
    if (event.key === "ArrowUp") {
      index = index === null ? history.length - 1 : Math.max(0, index - 1);
    } else {
      index = index === null ? null : Math.min(history.length - 1, index + 1);
      if (index === history.length - 1 && historyIndex === index) index = null;
    }

    setHistoryIndex(index);
    setValue(index === null ? "" : (history[index] ?? ""));
  }

  return (
    <div
      className="terminal"
      role="group"
      aria-label={t("title")}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-bar">
        <span className="terminal-dots">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-amber" />
          <span className="terminal-dot terminal-dot-green" />
        </span>
        <span className="terminal-title">
          <TerminalIcon className="console-title-icon" />
          {t("title")}
        </span>
      </div>
      <div className="terminal-body console-body">
        <div className="console-log" ref={outputRef} role="log" aria-live="polite">
          {lines.map((line, index) => (
            <p
              key={`${index}-${line.text}`}
              className={cn(
                "terminal-line",
                line.tone === "cmd" && "console-cmd",
                line.tone === "ok" && "console-ok",
                line.tone === "err" && "console-err",
                line.tone === "boot" && "console-boot",
              )}
            >
              {line.tone === "cmd" ? <span className="console-gt">$</span> : null}
              <span className="console-text">{line.text}</span>
            </p>
          ))}
        </div>
        <form className="terminal-line console-form" onSubmit={onSubmit}>
          <span className="console-gt">$</span>
          <input
            ref={inputRef}
            className="console-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label={t("inputLabel")}
            autoComplete="off"
            spellCheck={false}
            maxLength={80}
          />
        </form>
      </div>
    </div>
  );
}
