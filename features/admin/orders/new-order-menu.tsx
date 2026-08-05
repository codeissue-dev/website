import { createOrder } from './actions';
import { FormField } from '@/components/forms/form-field';
import { FormSelect } from '@/components/forms/form-select';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Dictionary } from '@/lib/i18n';

const currencyOptions = ['USD', 'EUR', 'RUB'].map((currency) => ({
  value: currency,
  label: currency,
}));

export function NewOrderMenu({
  copy,
}: {
  copy: Dictionary['admin']['orders'];
}) {
  return (
    <details className="group relative">
      <summary
        className={buttonVariants({
          size: 'md',
          className: 'list-none [&::-webkit-details-marker]:hidden',
        })}
      >
        + {copy.new}
      </summary>
      <form
        action={createOrder}
        className="absolute right-0 top-[calc(100%_+_0.75rem)] z-20 grid w-[min(25rem,calc(100vw_-_2rem))] gap-4 rounded-xl border border-border bg-card p-5 shadow-2xl shadow-black/60"
      >
        <FormField label={copy.titleLabel}>
          <Input
            name="title"
            minLength={3}
            maxLength={200}
            placeholder={copy.titlePlaceholder}
            required
          />
        </FormField>
        <div className="grid grid-cols-[1fr_7rem] gap-3">
          <FormField label={copy.valueLabel}>
            <Input
              type="number"
              name="value"
              min="0"
              max="100000000"
              step="0.01"
              defaultValue="0"
              required
            />
          </FormField>
          <FormField label={copy.currencyLabel}>
            <FormSelect
              name="currency"
              defaultValue="USD"
              options={currencyOptions}
              ariaLabel={copy.currencyLabel}
            />
          </FormField>
        </div>
        <Button type="submit">{copy.create}</Button>
      </form>
    </details>
  );
}
