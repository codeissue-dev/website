import Image from 'next/image';

import { cn } from '@/lib/utils';

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        'relative grid size-9 shrink-0 place-items-center overflow-visible',
        className,
      )}
    >
      <Image
        src="/images/codeissue-mark.svg"
        alt=""
        width={28}
        height={28}
        priority={priority}
        className="size-7 object-contain"
      />
    </span>
  );
}
