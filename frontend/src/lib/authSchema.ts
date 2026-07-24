import { z } from 'zod';

import { isValidEmail } from './email';

// Schemas back the Login/Register forms via zodResolver. `message` values are
// i18n keys (not literal text) — components translate them with t() before
// rendering, same convention as the rest of the app's error strings.
const email = z.string().refine(isValidEmail, { message: 'auth.register.errors.email' });

// Same shape as the manager's "register member" form: optional leading +, 7-20 digits/spaces/dashes/parens.
export const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

// At least one letter and one number, 8+ characters.
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { message: 'auth.login.errors.password' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const PLAN_IDS = ['1m', '3m', '6m', '12m'] as const;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'auth.register.errors.name' }),
    email,
    phoneNumber: z.string().regex(PHONE_PATTERN, { message: 'auth.register.errors.phoneNumber' }),
    password: z.string().regex(PASSWORD_PATTERN, { message: 'auth.register.errors.password' }),
    confirmPassword: z.string(),
    membershipPlan: z.enum(PLAN_IDS),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: 'auth.register.errors.confirmPassword',
    path: ['confirmPassword'],
  })
  .refine((data) => data.acceptTerms, {
    message: 'auth.register.errors.terms',
    path: ['acceptTerms'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Same fields as registerSchema minus email (already known from the Google account) —
// shown once, right after a first-time Google sign-in, to collect what Google doesn't give us.
export const completeProfileSchema = z
  .object({
    fullName: z.string().trim().min(1, { message: 'auth.register.errors.name' }),
    phoneNumber: z.string().regex(PHONE_PATTERN, { message: 'auth.register.errors.phoneNumber' }),
    password: z.string().regex(PASSWORD_PATTERN, { message: 'auth.register.errors.password' }),
    confirmPassword: z.string(),
    membershipPlan: z.enum(PLAN_IDS),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: 'auth.register.errors.confirmPassword',
    path: ['confirmPassword'],
  })
  .refine((data) => data.acceptTerms, {
    message: 'auth.register.errors.terms',
    path: ['acceptTerms'],
  });

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

// Password fields are optional here — leave both blank to keep the current password.
export const editProfileSchema = z
  .object({
    fullName: z.string().trim().min(1, { message: 'auth.register.errors.name' }),
    phoneNumber: z.string().regex(PHONE_PATTERN, { message: 'auth.register.errors.phoneNumber' }),
    password: z
      .string()
      .optional()
      .refine((value) => !value || PASSWORD_PATTERN.test(value), {
        message: 'auth.register.errors.password',
      }),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: 'auth.register.errors.confirmPassword',
    path: ['confirmPassword'],
  });

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
