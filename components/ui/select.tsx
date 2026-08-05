'use client';

import {
  createContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { CheckIcon, ChevronDownIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

type SelectContextValue = {
  value: string;
  open: boolean;
  contentId: string;
  setOpen: (open: boolean) => void;
  selectValue: (value: string) => void;
};

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) throw new Error('Select components must be used inside Select');
  return context;
}

export function Select({
  value,
  onValueChange,
  children,
  className,
  name,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const context = useMemo<SelectContextValue>(
    () => ({
      value,
      open,
      contentId,
      setOpen,
      selectValue(nextValue) {
        onValueChange(nextValue);
        setOpen(false);
      },
    }),
    [contentId, onValueChange, open, value],
  );

  return (
    <SelectContext.Provider value={context}>
      <div ref={rootRef} className={cn('relative inline-flex', className)}>
        {name ? <input type="hidden" name={name} value={value} /> : null}
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, contentId, setOpen } = useSelectContext();

  return (
    <button
      type="button"
      role="combobox"
      aria-controls={contentId}
      aria-expanded={open}
      aria-haspopup="listbox"
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'inline-flex h-9 min-w-36 items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-foreground shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] outline-none transition-[border-color,background-color,box-shadow] hover:border-border-strong hover:bg-surface-soft focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      onClick={() => setOpen(!open)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          setOpen(true);
        }
      }}
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <ChevronDownIcon
        className={cn(
          'size-4 shrink-0 text-muted-foreground transition-transform duration-150',
          open && 'rotate-180',
        )}
      />
    </button>
  );
}

export function SelectValue({ children }: { children: ReactNode }) {
  return <span className="flex min-w-0 items-center gap-2">{children}</span>;
}

export function SelectContent({
  className,
  children,
  align = 'end',
  ...props
}: HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'end' }) {
  const { open, contentId } = useSelectContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const selected = contentRef.current?.querySelector<HTMLElement>(
        '[role="option"][aria-selected="true"]',
      );
      selected?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="listbox"
      data-state="open"
      className={cn(
        'absolute top-[calc(100%+0.45rem)] z-[80] min-w-full overflow-hidden rounded-md border border-border-strong bg-popover p-1 text-popover-foreground shadow-[0_16px_48px_rgba(0,0,0,0.65)]',
        align === 'end' ? 'right-0' : 'left-0',
        className,
      )}
      onKeyDown={(event) => {
        const items = Array.from(
          contentRef.current?.querySelectorAll<HTMLButtonElement>(
            '[role="option"]',
          ) ?? [],
        );
        const currentIndex = items.indexOf(
          document.activeElement as HTMLButtonElement,
        );

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          const delta = event.key === 'ArrowDown' ? 1 : -1;
          const nextIndex =
            (Math.max(currentIndex, 0) + delta + items.length) % items.length;
          items[nextIndex]?.focus();
        }
        if (event.key === 'Home') {
          event.preventDefault();
          items[0]?.focus();
        }
        if (event.key === 'End') {
          event.preventDefault();
          items.at(-1)?.focus();
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  const { value: selectedValue, selectValue } = useSelectContext();
  const selected = selectedValue === value;

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        'relative flex w-full items-center gap-2 rounded-sm px-2.5 py-2 pr-8 text-left text-sm outline-none transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]',
        selected && 'bg-white/[0.06] text-foreground',
        className,
      )}
      onClick={() => selectValue(value)}
    >
      {children}
      {selected ? (
        <CheckIcon className="absolute right-2.5 size-4 text-signal-soft" />
      ) : null}
    </button>
  );
}
