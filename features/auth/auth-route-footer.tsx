import Link from 'next/link';

export function AuthRouteFooter({
  alternateHref,
  alternateLabel,
  backLabel,
}: {
  alternateHref: string;
  alternateLabel: string;
  backLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Link href="/" className="hover:text-foreground">
        &lt;- {backLabel}
      </Link>
      <Link href={alternateHref} className="hover:text-foreground">
        {alternateLabel}
      </Link>
    </div>
  );
}
