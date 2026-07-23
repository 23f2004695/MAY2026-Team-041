import { z } from 'zod';

import { isValidEmail } from './email';

// Schemas back the Login/Register forms via zodResolver. `message` values are
// i18n keys (not literal text) — components translate them with t() before
// rendering, same convention as the rest of the app's error strings.
const email = z.string().refine(isValidEmail, { message: 'auth.register.errors.email' });

// Same shape as the manager's "register member" form: optional leading +, 7-20 digits/spaces/dashes/parens.
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

// At least one letter and one number, 8+ characters.
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { message: 'auth.login.errors.password' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'auth.register.errors.name' }),
    email,
    phoneNumber: z.string().regex(PHONE_PATTERN, { message: 'auth.register.errors.phoneNumber' }),
    password: z.string().regex(PASSWORD_PATTERN, { message: 'auth.register.errors.password' }),
    confirmPassword: z.string(),
    membershipPlan: z.enum(['basic', 'standard', 'premium']),
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
