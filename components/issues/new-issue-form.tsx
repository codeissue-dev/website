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
      className="inline-flex h-12 items-center justify-between border border-signal bg-signal px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-signal-soft disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? copy.submitting : copy.submit}
      <span aria-hidden="true">-&gt;</span>
    </button>
  );
}

export function NewIssueForm({ copy }: { copy: NewIssueCopy }) {
  const [state, action] = useActionState(createPublicIssue, {});
  const error = state.error
    ? (copy.errors[state.error] ?? copy.errors.unknown)
    : null;

  return (
    <form action={action} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
            {copy.fields.title}
          </span>
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
          <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
            {copy.fields.projectType}
          </span>
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
        <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
          {copy.fields.brief}
        </span>
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
        <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
          {copy.fields.outcome}
        </span>
        <textarea
          name="desiredOutcome"
          minLength={10}
          maxLength={2000}
          required
          placeholder={copy.fields.outcomePlaceholder}
          className={textareaClass}
        />
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
            {copy.fields.contactChannel}
          </span>
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
          <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
            {copy.fields.contactHandle}
          </span>
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
        <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
          {copy.fields.budget}
        </span>
        <input
          type="text"
          name="budgetRange"
          maxLength={80}
          placeholder={copy.fields.budgetPlaceholder}
          className={fieldClass}
        />
      </label>

      {error ? <p className="m-0 text-sm text-danger">{error}</p> : null}
      <SubmitButton copy={copy} />
    </form>
  );
}
