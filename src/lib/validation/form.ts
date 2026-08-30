/**
 * FormData readers.
 *
 * `FormData.get` returns `string | File | null`. These helpers narrow that to
 * the shapes the Zod schemas expect, without casts, so a crafted multipart
 * request cannot smuggle a file where a string is required.
 */
export function formValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

/** Text field: absent, wrong type and empty are all normalized to "". */
export function formText(formData: FormData, key: string): string {
  return formValue(formData, key) ?? "";
}

/** Unchecked checkboxes are simply absent from the payload. */
export function formFlag(formData: FormData, key: string): boolean {
  return formData.get(key) !== null;
}

/** Explicit boolean carried by a hidden input, e.g. publish/unpublish buttons. */
export function formBooleanValue(formData: FormData, key: string): boolean {
  return formValue(formData, key) === "true";
}
