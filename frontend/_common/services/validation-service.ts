import { z } from 'zod';

export const signInValidationSchema = z.object({
  emailAddress: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password is too long'),
});

export const signUpValidationSchema = z
  .object({
    displayName: z
      .string()
      .min(1, 'Display name is required')
      .min(2, 'Display name must be at least 2 characters')
      .max(50, 'Display name is too long'),
    emailAddress: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password is too long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((formData) => formData.password === formData.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function validateSignInForm(
  formValues: Entity.SignInFormValues,
): Entity.AuthValidationErrors {
  const validationResult = signInValidationSchema.safeParse(formValues);
  if (validationResult.success) return {};

  const errors: Entity.AuthValidationErrors = {};
  for (const issue of validationResult.error.issues) {
    const fieldName = issue.path[0] as keyof Entity.AuthValidationErrors;
    if (fieldName && !errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  }
  return errors;
}

export function validateSignUpForm(
  formValues: Entity.SignUpFormValues,
): Entity.AuthValidationErrors {
  const validationResult = signUpValidationSchema.safeParse(formValues);
  if (validationResult.success) return {};

  const errors: Entity.AuthValidationErrors = {};
  for (const issue of validationResult.error.issues) {
    const fieldName = issue.path[0] as keyof Entity.AuthValidationErrors;
    if (fieldName && !errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  }
  return errors;
}
