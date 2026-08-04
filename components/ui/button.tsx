import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const variantClasses = {
  default:
    'border-signal bg-signal text-primary-foreground hover:border-signal-soft hover:bg-signal-soft',
  secondary:
    'border-border-strong bg-black text-foreground hover:border-signal hover:text-signal-soft',
  outline:
    'border-current bg-transparent text-foreground hover:border-signal hover:text-signal-soft',
  ghost:
    'border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-surface-soft hover:text-foreground',
  destructive:
    'border-danger bg-danger text-black hover:border-foreground hover:bg-foreground',
} as const;

const sizeClasses = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
  icon: 'size-10',
} as const;

export function buttonVariants({
  variant = 'default',
  size = 'md',
  className,
}: {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  className?: string;
} = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border font-semibold transition-[background-color,border-color,color] duration-150 outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
}) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
