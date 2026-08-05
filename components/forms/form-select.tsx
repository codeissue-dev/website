'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type FormSelectOption = {
  value: string;
  label: string;
  prefix?: string;
};

export function FormSelect({
  name,
  defaultValue,
  options,
  ariaLabel,
  className,
}: {
  name: string;
  defaultValue: string;
  options: FormSelectOption[];
  ariaLabel: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const selected =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <Select
      name={name}
      value={value}
      onValueChange={setValue}
      className={cn('w-full', className)}
    >
      <SelectTrigger aria-label={ariaLabel} className="h-11 w-full">
        <SelectValue>
          {selected?.prefix ? (
            <span aria-hidden="true">{selected.prefix}</span>
          ) : null}
          <span className="truncate">{selected?.label}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" className="w-full">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.prefix ? (
              <span aria-hidden="true">{option.prefix}</span>
            ) : null}
            <span>{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
