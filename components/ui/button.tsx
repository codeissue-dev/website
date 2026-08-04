import * as React from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variants: Record<ButtonVariant, string> = {
  default:
    'border border-primary bg-primary text-primary-foreground hover:border-signal-soft hover:bg-signal-soft',
  secondary:
    'border border-border-strong bg-surface text-foreground hover:border-signal hover:text-signal-soft',
  outline:
    'border border-current bg-transparent text-current hover:bg-current hover:text-background',
  ghost:
    'border border-transparent text-muted-foreground hover:border-border hover:bg-surface-soft hover:text-foreground',
};

const sizes: Record<ButtonSize, string> = {
  default: 'h-11 px-5 text-sm',
  sm: 'h-9 px-3.5 text-xs',
  lg: 'h-12 px-5 text-sm sm:px-6',
  icon: 'size-10',
};

export function buttonVariants({
  variant = 'default',
  size = 'default',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-[background-color,border-color,color,transform] duration-150 outline-none hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0',
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
