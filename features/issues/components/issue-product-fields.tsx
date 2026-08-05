import { FormField } from '@/components/forms/form-field';
import { FormSelect } from '@/components/forms/form-select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type { NewIssueCopy } from '../types';

export function IssueProductFields({
  fields,
}: {
  fields: NewIssueCopy['fields'];
}) {
  const projectTypeOptions = Object.entries(fields.projectTypes).map(
    ([value, label]) => ({ value, label }),
  );

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label={fields.title}>
          <Input
            name="title"
            minLength={3}
            maxLength={160}
            required
            placeholder={fields.titlePlaceholder}
          />
        </FormField>
        <FormField label={fields.projectType}>
          <FormSelect
            name="projectType"
            defaultValue="web-product"
            options={projectTypeOptions}
            ariaLabel={fields.projectType}
          />
        </FormField>
      </div>

      <FormField label={fields.brief}>
        <Textarea
          name="brief"
          minLength={30}
          maxLength={5000}
          required
          placeholder={fields.briefPlaceholder}
        />
      </FormField>

      <FormField label={fields.outcome}>
        <Textarea
          name="desiredOutcome"
          minLength={10}
          maxLength={2000}
          required
          placeholder={fields.outcomePlaceholder}
        />
      </FormField>
    </>
  );
}
