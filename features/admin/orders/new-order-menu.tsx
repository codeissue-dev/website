import { createOrder } from './actions';
import { FormField } from '@/components/forms/form-field';
import { buttonVariants } from '@/components/ui/button';
import type { Dictionary } from '@/lib/i18n';
import { fieldClass } from '@/lib/ui/styles';

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
          <input
            type="text"
            name="title"
            minLength={3}
            maxLength={200}
            placeholder={copy.titlePlaceholder}
            required
            className={fieldClass}
          />
        </FormField>
        <div className="grid grid-cols-[1fr_7rem] gap-3">
          <FormField label={copy.valueLabel}>
            <input
              type="number"
              name="value"
              min="0"
              max="100000000"
              step="0.01"
              defaultValue="0"
              required
              className={fieldClass}
            />
          </FormField>
          <FormField label={copy.currencyLabel}>
            <select name="currency" defaultValue="USD" className={fieldClass}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
            </select>
          </FormField>
        </div>
        <button type="submit" className={buttonVariants({ size: 'md' })}>
          {copy.create}
        </button>
      </form>
    </details>
  );
}
