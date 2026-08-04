'use client';

import { useFormStatus } from 'react-dom';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SubmitButton({
  idle,
  pending: pendingLabel,
  className,
  fullWidth = false,
}: {
  idle: string;
  pending: string;
  className?: string;
  fullWidth?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        buttonVariants({ size: 'lg' }),
        fullWidth && 'w-full',
        className,
      )}
    >
      {pending ? pendingLabel : idle}
      <span aria-hidden="true">-&gt;</span>
    </button>
  );
}
