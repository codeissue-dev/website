'use client';

import { useActionState, useState } from 'react';

import { FormError } from '@/components/forms/form-field';
import { SubmitButton } from '@/components/forms/submit-button';

import { createPublicIssue, type NewIssueState } from './actions';
import { IssueContactFields } from './components/issue-contact-fields';
import { IssueProductFields } from './components/issue-product-fields';
import type { NewIssueCopy } from './types';

export function NewIssueForm({ copy }: { copy: NewIssueCopy }) {
  const [requestId] = useState(() => crypto.randomUUID());
  const [state, action] = useActionState(createPublicIssue, {
    error: undefined,
  } as NewIssueState);
  const error = state.error
    ? (copy.errors[state.error] ?? copy.errors.unknown)
    : null;

  return (
    <form action={action} className="grid gap-7">
      <input type="hidden" name="requestId" value={requestId} />
      <IssueProductFields fields={copy.fields} />
      <IssueContactFields fields={copy.fields} />
      <FormError>{error}</FormError>
      <div className="flex justify-end border-t border-border pt-6">
        <SubmitButton idle={copy.submit} pending={copy.submitting} />
      </div>
    </form>
  );
}
