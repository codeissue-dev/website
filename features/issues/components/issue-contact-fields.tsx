import { FormField } from '@/components/forms/form-field';
import { fieldClass } from '@/lib/ui/styles';

import type { NewIssueCopy } from '../types';
import { contactChannels, formatContactChannel } from './issue-form-options';

export function IssueContactFields({
  fields,
}: {
  fields: NewIssueCopy['fields'];
}) {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label={fields.contactChannel}>
          <select
            name="contactChannel"
            required
            className={fieldClass}
            defaultValue="telegram"
          >
            {contactChannels.map((channel) => (
              <option key={channel} value={channel}>
                {formatContactChannel(channel)}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={fields.contactHandle}>
          <input
            type="text"
            name="contactHandle"
            minLength={2}
            maxLength={120}
            required
            placeholder={fields.contactHandlePlaceholder}
            className={fieldClass}
          />
        </FormField>
      </div>

      <FormField label={fields.budget}>
        <input
          type="text"
          name="budgetRange"
          maxLength={80}
          placeholder={fields.budgetPlaceholder}
          className={fieldClass}
        />
      </FormField>
    </>
  );
}
