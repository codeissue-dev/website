import * as React from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variants: Record<ButtonVariant, string> = {
  default:
    'border border-[#e6ffff] bg-[#baffff] text-[#001113] shadow-[0_12px_32px_rgba(84,222,229,0.18)] hover:bg-[#e0ffff] hover:text-[#000b0c]',
  secondary:
    'border border-white/20 bg-[#0a0c0d] text-[#f8faf9] hover:border-white/40 hover:bg-[#121617]',
  outline:
    'border border-white/16 bg-black text-foreground hover:border-primary/60 hover:bg-primary/[0.06]',
  ghost: 'text-muted-foreground hover:bg-white/[0.06] hover:text-foreground',
};

const sizes: Record<ButtonSize, string> = {
  default: 'h-11 rounded-[11px] px-5 text-sm',
  sm: 'h-9 rounded-[10px] px-4 text-xs',
  lg: 'h-13 rounded-[12px] px-7 text-sm sm:text-base',
  icon: 'size-11 rounded-[11px]',
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
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-300 outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
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
