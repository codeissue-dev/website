import { z } from "zod";

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/auth/password";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Enter your email address")
  .max(254, "That email address is too long")
  .pipe(z.email("Enter a valid email address"));

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, "That password is too long")
  .refine((value) => /\p{L}/u.test(value), "Include at least one letter")
  .refine((value) => /\d/u.test(value), "Include at least one number");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter your name")
  .max(120, "That name is too long");

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Login input. Deliberately looser than registration: existing passwords are
 * only checked against the stored hash, never re-validated for complexity.
 */
export const credentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password").max(PASSWORD_MAX_LENGTH),
});

export const profileSchema = z.object({
  name: nameSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
