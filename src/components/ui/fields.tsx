import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Text inputs, textareas and selects share one control style. */
export const CONTROL_CLASS = "field-control";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

/** Shared label, hint and error shell, wired for screen readers. */
function FieldShell({ id, label, hint, error, required, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-ink-subtle">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error">
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
        className={cn("checkbox-control", className)}
        aria-describedby={hint ? `${fieldId}-hint` : undefined}
        {...props}
      />
      <div className="flex flex-col gap-0.5">
        <label htmlFor={fieldId} className="field-label">
          {label}
        </label>
        {hint ? (
          <p id={`${fieldId}-hint`} className="field-hint">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
