"use client";

import { useActionState } from "react";

import { createOrderAction } from "@/actions/orders";
import { firstFieldError, idleActionState } from "@/actions/state";
import { TextAreaField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";

/** Today in the visitor's timezone, so the date picker cannot offer the past. */
function todayIsoDate(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

export function NewOrderForm() {
  const [state, formAction] = useActionState(createOrderAction, idleActionState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        name="title"
        label="Project title"
        required
        minLength={6}
        maxLength={140}
        placeholder="Warehouse picking assistant"
        hint="A short name we can use when we talk about this project."
        error={firstFieldError(state, "title")}
      />

      <TextAreaField
        name="detailedDescription"
        label="Describe the idea"
        required
        minLength={80}
        maxLength={8000}
        rows={8}
        placeholder="What should exist when this is finished? Who uses it, and how?"
        hint="The more concrete this is, the more accurate our estimate will be."
        error={firstFieldError(state, "detailedDescription")}
      />

      <TextAreaField
        name="problemStatement"
        label="Problem and goals"
        required
        minLength={30}
        maxLength={2000}
        rows={4}
        placeholder="What is broken or missing today, and what should improve?"
        error={firstFieldError(state, "problemStatement")}
      />

      <TextAreaField
        name="keyFeatures"
        label="Important features"
        required
        minLength={20}
        maxLength={4000}
        rows={4}
        placeholder="List the parts that matter most. One per line is fine."
        error={firstFieldError(state, "keyFeatures")}
      />

      <TextAreaField
        name="technicalPreferences"
        label="Technical preferences"
        maxLength={2000}
        rows={3}
        placeholder="Existing systems, hosting, languages you must stay with."
        hint="Optional. Leave empty if you have no constraints."
        error={firstFieldError(state, "technicalPreferences")}
      />

      <TextAreaField
        name="referenceLinks"
        label="References and examples"
        maxLength={2000}
        rows={3}
        placeholder="Links to products, screenshots or documents we should look at."
        hint="Optional."
        error={firstFieldError(state, "referenceLinks")}
      />

      <TextField
        name="desiredDeadline"
        label="Requested deadline"
        type="date"
        min={todayIsoDate()}
        hint="Optional. We will tell you honestly whether it is realistic."
        error={firstFieldError(state, "desiredDeadline")}
      />

      <FormMessage state={state} />

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Submitting…">Submit request</SubmitButton>
      </div>
    </form>
  );
}
