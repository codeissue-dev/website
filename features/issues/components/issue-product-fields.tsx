import { FormField } from '@/components/forms/form-field';
import { fieldClass, textareaClass } from '@/lib/ui/styles';

import type { NewIssueCopy } from '../types';

export function IssueProductFields({
  fields,
}: {
  fields: NewIssueCopy['fields'];
}) {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label={fields.title}>
          <input
            type="text"
            name="title"
            minLength={3}
            maxLength={160}
            required
            placeholder={fields.titlePlaceholder}
            className={fieldClass}
          />
        </FormField>
        <FormField label={fields.projectType}>
          <select
            name="projectType"
            required
            className={fieldClass}
            defaultValue="web-product"
          >
            {Object.entries(fields.projectTypes).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label={fields.brief}>
        <textarea
          name="brief"
          minLength={30}
          maxLength={5000}
          required
          placeholder={fields.briefPlaceholder}
          className={textareaClass}
        />
      </FormField>

      <FormField label={fields.outcome}>
        <textarea
          name="desiredOutcome"
          minLength={10}
          maxLength={2000}
          required
          placeholder={fields.outcomePlaceholder}
          className={textareaClass}
        />
      </FormField>
    </>
  );
}
