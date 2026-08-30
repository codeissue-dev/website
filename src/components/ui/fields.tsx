import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const CONTROL_CLASS =
  "w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-critical";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

/**
 * One label/hint/error shell for every control, so the accessible wiring
 * (`for`, `aria-describedby`, `aria-invalid`) is written once and cannot drift
 * between forms.
 */
function FieldShell({ id, label, hint, error, required, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-ink-subtle">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(
    (value): value is string => value !== null,
  );
  return ids.length > 0 ? ids.join(" ") : undefined;
}

type CommonFieldProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({
  name,
  label,
  hint,
  error,
  className,
  id,
  ...props
}: CommonFieldProps & Omit<ComponentProps<"input">, "name">) {
  const fieldId = id ?? name;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={props.required}
    >
      <input
        id={fieldId}
        name={name}
        className={cn(CONTROL_CLASS, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        {...props}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  name,
  label,
  hint,
  error,
  className,
  id,
  rows,
  ...props
}: CommonFieldProps & Omit<ComponentProps<"textarea">, "name">) {
  const fieldId = id ?? name;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={props.required}
    >
      <textarea
        id={fieldId}
        name={name}
        rows={rows ?? 5}
        className={cn(CONTROL_CLASS, "resize-y", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        {...props}
      />
    </FieldShell>
  );
}

export type SelectOption = { value: string; label: string };

export function SelectField({
  name,
  label,
  hint,
  error,
  className,
  id,
  options,
  ...props
}: CommonFieldProps &
  Omit<ComponentProps<"select">, "name" | "children"> & { options: SelectOption[] }) {
  const fieldId = id ?? name;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={props.required}
    >
      <select
        id={fieldId}
        name={name}
        className={cn(CONTROL_CLASS, "pr-8", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({
  name,
  label,
  hint,
  id,
  className,
  ...props
}: CommonFieldProps & Omit<ComponentProps<"input">, "name" | "type">) {
  const fieldId = id ?? name;
  return (
    <div className="flex items-start gap-2.5">
      <input
        id={fieldId}
        name={name}
        type="checkbox"
        className={cn(
          "mt-0.5 size-4 rounded border-line-strong text-ink accent-ink",
          className,
        )}
        aria-describedby={hint ? `${fieldId}-hint` : undefined}
        {...props}
      />
      <div className="flex flex-col gap-0.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-ink">
          {label}
        </label>
        {hint ? (
          <p id={`${fieldId}-hint`} className="text-xs text-ink-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
