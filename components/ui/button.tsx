import * as React from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variants: Record<ButtonVariant, string> = {
  default:
    'bg-primary text-primary-foreground shadow-[0_0_30px_-12px_var(--primary)] hover:-translate-y-0.5 hover:shadow-[0_0_38px_-10px_var(--primary)]',
  secondary:
    'border border-white/10 bg-white/[0.06] text-foreground hover:border-white/20 hover:bg-white/[0.1]',
  outline:
    'border border-white/14 bg-black/20 text-foreground hover:border-primary/50 hover:bg-primary/[0.08]',
  ghost: 'text-muted-foreground hover:bg-white/[0.06] hover:text-foreground',
};

const sizes: Record<ButtonSize, string> = {
  default: 'h-11 rounded-full px-5 text-sm',
  sm: 'h-9 rounded-full px-4 text-xs',
  lg: 'h-13 rounded-full px-7 text-sm sm:text-base',
  icon: 'size-11 rounded-full',
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
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,border-color,color,box-shadow] duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
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
