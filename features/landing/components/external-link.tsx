import type { AnchorHTMLAttributes, ReactNode } from 'react';

export function ExternalLink({
  href,
  className,
  children,
  label,
  ...props
}: {
  href: string;
  className?: string;
  children: ReactNode;
  label?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
