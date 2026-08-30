"use client";

import { useActionState } from "react";

import { firstFieldError, idleActionState } from "@/actions/state";
import type { ActionState } from "@/actions/state";
import { CheckboxField, TextAreaField, TextField } from "@/components/ui/fields";
import { SubmitButton } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";

export type PortfolioFormDefaults = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  techStack: string;
  industry: string;
  projectUrl: string;
  deliveryWeeks: string;
  sortOrder: string;
  published: boolean;
};

export const emptyPortfolioDefaults: PortfolioFormDefaults = {
  slug: "",
  title: "",
  summary: "",
  problem: "",
  solution: "",
  techStack: "",
  industry: "",
  projectUrl: "",
  deliveryWeeks: "",
  sortOrder: "0",
  published: false,
};

/**
 * Create/edit form for one published case study.
 *
 * The Server Action is passed in so the same markup serves both the create and
 * the update path, and every constraint below mirrors the Zod schema that the
 * action enforces on the server.
 */
export function PortfolioForm({
  action,
  defaults,
  itemId,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaults: PortfolioFormDefaults;
  itemId?: string;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, idleActionState);
  const prefix = itemId ?? "new";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {itemId ? <input type="hidden" name="id" value={itemId} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`${prefix}-title`}
          name="title"
          label="Project title"
          required
          minLength={3}
          maxLength={140}
          defaultValue={defaults.title}
          error={firstFieldError(state, "title")}
        />
        <TextField
          id={`${prefix}-slug`}
          name="slug"
          label="URL slug"
          required
          minLength={3}
          maxLength={80}
          defaultValue={defaults.slug}
          hint="Lowercase words separated by single hyphens."
          error={firstFieldError(state, "slug")}
        />
      </div>

      <TextAreaField
        id={`${prefix}-summary`}
        name="summary"
        label="Summary"
        required
        minLength={20}
        maxLength={300}
        rows={2}
        defaultValue={defaults.summary}
        hint="One or two sentences, shown on the landing page and the portfolio index."
        error={firstFieldError(state, "summary")}
      />

      <TextAreaField
        id={`${prefix}-problem`}
        name="problem"
        label="The problem"
        required
        minLength={20}
        maxLength={2000}
        rows={4}
        defaultValue={defaults.problem}
        error={firstFieldError(state, "problem")}
      />

      <TextAreaField
        id={`${prefix}-solution`}
        name="solution"
        label="What we built"
        required
        minLength={20}
        maxLength={2000}
        rows={4}
        defaultValue={defaults.solution}
        error={firstFieldError(state, "solution")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`${prefix}-techStack`}
          name="techStack"
          label="Technology"
          maxLength={1000}
          defaultValue={defaults.techStack}
          hint="Comma separated, for example: Next.js, PostgreSQL, Stripe"
          error={firstFieldError(state, "techStack")}
        />
        <TextField
          id={`${prefix}-industry`}
          name="industry"
          label="Industry"
          maxLength={80}
          defaultValue={defaults.industry}
          hint="Optional."
          error={firstFieldError(state, "industry")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          id={`${prefix}-projectUrl`}
          name="projectUrl"
          label="Live URL"
          type="url"
          inputMode="url"
          placeholder="https://"
          defaultValue={defaults.projectUrl}
          hint="Optional."
          error={firstFieldError(state, "projectUrl")}
        />
        <TextField
          id={`${prefix}-deliveryWeeks`}
          name="deliveryWeeks"
          label="Delivered in (weeks)"
          type="number"
          min={1}
          max={260}
          step={1}
          defaultValue={defaults.deliveryWeeks}
          hint="Optional."
          error={firstFieldError(state, "deliveryWeeks")}
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
        hint="Only published case studies appear on the public site."
      />

      <FormMessage state={state} />

      <div className="flex justify-end">
        <SubmitButton size="sm" pendingLabel="Saving…">
          {submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
}
