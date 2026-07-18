import { z } from 'zod';

// Schemas back the Login/Register forms via zodResolver. `message` values are
// i18n keys (not literal text) — components translate them with t() before
// rendering, same convention as the rest of the app's error strings.
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const email = z.string().regex(EMAIL_PATTERN, { message: 'auth.register.errors.email' });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { message: 'auth.login.errors.password' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'auth.register.errors.name' }),
    email,
    password: z.string().min(8, { message: 'auth.register.errors.password' }),
    confirmPassword: z.string(),
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
