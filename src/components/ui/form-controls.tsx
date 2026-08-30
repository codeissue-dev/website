"use client";

import { useFormStatus } from "react-dom";

import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

/**
 * Submit button bound to the enclosing form's pending state.
 *
 * `useFormStatus` reads the real submission state, so the disabled and pending
 * appearance always reflects work that is genuinely in flight.
 */
export function SubmitButton({
  children,
  pendingLabel,
  variant,
  size,
  className,
  disabled,
  name,
  value,
}: {
  children: string;
  pendingLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      disabled={disabled === true || pending}
      aria-busy={pending}
      name={name}
      value={value}
    >
      {pending ? (pendingLabel ?? "Working…") : children}
    </Button>
  );
}

/**
 * Submit button for destructive actions: requires an explicit confirmation
 * before the form is allowed to submit.
 */
export function ConfirmSubmitButton({
  children,
  confirmMessage,
  pendingLabel,
  variant,
  size,
  className,
}: {
  children: string;
  confirmMessage: string;
  pendingLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant ?? "danger"}
      size={size}
      className={className}
      disabled={pending}
      aria-busy={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      {pending ? (pendingLabel ?? "Working…") : children}
    </Button>
  );
}
