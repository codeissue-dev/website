'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { createPublicIssue } from '@/app/issues/new/actions';
import { fieldClass, textareaClass } from '@/lib/ui/styles';

type NewIssueCopy = {
  fields: {
    title: string;
    titlePlaceholder: string;
    projectType: string;
    projectTypes: Record<string, string>;
    brief: string;
    briefPlaceholder: string;
    outcome: string;
    outcomePlaceholder: string;
    contactChannel: string;
    contactHandle: string;
    contactHandlePlaceholder: string;
    budget: string;
    budgetPlaceholder: string;
  };
  submit: string;
  submitting: string;
  errors: Record<string, string>;
};

function SubmitButton({ copy }: { copy: NewIssueCopy }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? copy.submitting : copy.submit}
      <span aria-hidden="true">-&gt;</span>
    </button>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="text-sm font-medium text-foreground">{children}</span>
  );
}

export function NewIssueForm({ copy }: { copy: NewIssueCopy }) {
  const [state, action] = useActionState(createPublicIssue, {});
  const error = state.error
    ? (copy.errors[state.error] ?? copy.errors.unknown)
    : null;

  return (
    <form action={action} className="grid gap-7">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <FieldLabel>{copy.fields.title}</FieldLabel>
          <input
            type="text"
            name="title"
            minLength={3}
            maxLength={160}
            required
            placeholder={copy.fields.titlePlaceholder}
            className={fieldClass}
          />
        </label>
        <label className="grid gap-2">
          <FieldLabel>{copy.fields.projectType}</FieldLabel>
          <select
            name="projectType"
            required
            className={fieldClass}
            defaultValue="web-product"
          >
            {Object.entries(copy.fields.projectTypes).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2">
        <FieldLabel>{copy.fields.brief}</FieldLabel>
        <textarea
          name="brief"
          minLength={30}
          maxLength={5000}
          required
          placeholder={copy.fields.briefPlaceholder}
          className={textareaClass}
        />
      </label>

      <label className="grid gap-2">
        <FieldLabel>{copy.fields.outcome}</FieldLabel>
        <textarea
          name="desiredOutcome"
          minLength={10}
          maxLength={2000}
          required
          placeholder={copy.fields.outcomePlaceholder}
          className={textareaClass}
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <FieldLabel>{copy.fields.contactChannel}</FieldLabel>
          <select
            name="contactChannel"
            required
            className={fieldClass}
            defaultValue="telegram"
          >
            <option value="telegram">Telegram</option>
            <option value="discord">Discord</option>
            <option value="max">MAX</option>
            <option value="instagram">Instagram</option>
            <option value="x">X</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="grid gap-2">
          <FieldLabel>{copy.fields.contactHandle}</FieldLabel>
          <input
            type="text"
            name="contactHandle"
            minLength={2}
            maxLength={120}
            required
            placeholder={copy.fields.contactHandlePlaceholder}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="grid gap-2">
        <FieldLabel>{copy.fields.budget}</FieldLabel>
        <input
          type="text"
          name="budgetRange"
          maxLength={80}
          placeholder={copy.fields.budgetPlaceholder}
          className={fieldClass}
        />
      </label>

      {error ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end border-t border-border pt-6">
        <SubmitButton copy={copy} />
      </div>
    </form>
  );
}
