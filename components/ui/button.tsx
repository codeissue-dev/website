import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const variantClasses = {
  default:
    'border-white bg-white text-black shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] hover:border-zinc-200 hover:bg-zinc-200',
  secondary:
    'border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-soft',
  outline:
    'border-border bg-transparent text-foreground hover:border-border-strong hover:bg-white/[0.04]',
  ghost:
    'border-transparent bg-transparent text-muted-foreground hover:bg-white/[0.05] hover:text-foreground',
  destructive:
    'border-danger bg-danger text-black hover:border-red-300 hover:bg-red-300',
} as const;

const sizeClasses = {
  sm: 'h-9 px-3 text-sm',
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
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 outline-none hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0',
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
