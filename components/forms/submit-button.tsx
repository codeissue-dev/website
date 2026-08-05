'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
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
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className={cn(fullWidth && 'w-full', className)}
    >
      {pending ? pendingLabel : idle}
      <span aria-hidden="true">-&gt;</span>
    </Button>
  );
}
