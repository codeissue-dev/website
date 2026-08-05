import { FormField } from '@/components/forms/form-field';
import { FormSelect } from '@/components/forms/form-select';
import { Input } from '@/components/ui/input';

import type { NewIssueCopy } from '../types';
import { contactChannels, formatContactChannel } from './issue-form-options';

export function IssueContactFields({
  fields,
}: {
  fields: NewIssueCopy['fields'];
}) {
  const contactOptions = contactChannels.map((channel) => ({
    value: channel,
    label: formatContactChannel(channel),
  }));

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label={fields.contactChannel}>
          <FormSelect
            name="contactChannel"
            defaultValue="telegram"
            options={contactOptions}
            ariaLabel={fields.contactChannel}
          />
        </FormField>
        <FormField label={fields.contactHandle}>
          <Input
            name="contactHandle"
            minLength={2}
            maxLength={120}
            required
            placeholder={fields.contactHandlePlaceholder}
          />
        </FormField>
      </div>

      <FormField label={fields.budget}>
        <Input
          name="budgetRange"
          maxLength={80}
          placeholder={fields.budgetPlaceholder}
        />
      </FormField>
    </>
  );
}
