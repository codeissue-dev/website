"use client";

import { useActionState } from "react";

import { firstFieldError, idleActionState } from "@/actions/state";
import type { ActionState } from "@/actions/state";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/fields";
import type { SelectOption } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";

/**
 * The little the form needs to know about a delivered order. Declared here so a
 * Client Component never imports the server-only data layer.
 */
export type DeliveredOrderChoice = {
  id: string;
  reference: string;
  title: string;
};

export type TestimonialFormDefaults = {
  authorName: string;
  authorRole: string;
  company: string;
  quote: string;
  rating: string;
  orderId: string;
  sortOrder: string;
  published: boolean;
};

export const emptyTestimonialDefaults: TestimonialFormDefaults = {
  authorName: "",
  authorRole: "",
  company: "",
  quote: "",
  rating: "",
  orderId: "",
  sortOrder: "0",
  published: false,
};

const RATING_OPTIONS: SelectOption[] = [
  { value: "", label: "No rating" },
  { value: "5", label: "5 of 5" },
  { value: "4", label: "4 of 5" },
  { value: "3", label: "3 of 5" },
  { value: "2", label: "2 of 5" },
  { value: "1", label: "1 of 5" },
];

/**
 * Create/edit form for one testimonial.
 *
 * Testimonials can be attached to a delivered order so the public quote is
 * traceable to real work. Every limit mirrors `testimonialSchema`, which the
 * Server Action re-validates.
 */
export function TestimonialForm({
  action,
  defaults,
  testimonialId,
  submitLabel,
  deliveredOrders,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaults: TestimonialFormDefaults;
  testimonialId?: string;
  submitLabel: string;
  deliveredOrders: readonly DeliveredOrderChoice[];
}) {
  const [state, formAction] = useActionState(action, idleActionState);
  const prefix = testimonialId ?? "new";
  const orderOptions: SelectOption[] = [
    { value: "", label: "Not linked to an order" },
    ...deliveredOrders.map((order) => ({
      value: order.id,
      label: `${order.reference} \u2014 ${order.title}`,
    })),
  ];

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {testimonialId ? <input type="hidden" name="id" value={testimonialId} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`${prefix}-authorName`}
          name="authorName"
          label="Author name"
          required
          minLength={2}
          maxLength={120}
          defaultValue={defaults.authorName}
          error={firstFieldError(state, "authorName")}
        />
        <TextField
          id={`${prefix}-authorRole`}
          name="authorRole"
          label="Role"
          maxLength={120}
          defaultValue={defaults.authorRole}
          hint="Optional, for example: Head of Operations"
          error={firstFieldError(state, "authorRole")}
        />
      </div>

      <TextField
        id={`${prefix}-company`}
        name="company"
        label="Company"
        maxLength={120}
        defaultValue={defaults.company}
        hint="Optional."
        error={firstFieldError(state, "company")}
      />

      <TextAreaField
        id={`${prefix}-quote`}
        name="quote"
        label="Quote"
        required
        minLength={40}
        maxLength={1200}
        rows={4}
        defaultValue={defaults.quote}
        hint="Publish only wording the customer actually gave you, with their consent."
        error={firstFieldError(state, "quote")}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          id={`${prefix}-rating`}
          name="rating"
          label="Rating"
          options={RATING_OPTIONS}
          defaultValue={defaults.rating}
          error={firstFieldError(state, "rating")}
        />
        <SelectField
          id={`${prefix}-orderId`}
          name="orderId"
          label="Related project"
          options={orderOptions}
          defaultValue={defaults.orderId}
          hint="Completed projects only."
          error={firstFieldError(state, "orderId")}
        />
        <TextField
          id={`${prefix}-sortOrder`}
          name="sortOrder"
          label="Sort order"
          type="number"
          min={-1000}
          max={1000}
          step={1}
          defaultValue={defaults.sortOrder}
          hint="Lower values appear first."
          error={firstFieldError(state, "sortOrder")}
        />
      </div>

      <CheckboxField
        id={`${prefix}-published`}
        name="published"
        label="Published"
        defaultChecked={defaults.published}
        hint="Only published testimonials appear on the public site."
      />

      <FormMessage state={state} />

      <div className="flex justify-end">
        <SubmitButton size="sm" pendingLabel="Saving\u2026">
          {submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
}
