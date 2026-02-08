import { z } from "zod";

// ========== PASSWORD VALIDATION ==========
// Password must be at least 8 characters and contain complexity requirements
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Simpler password validation for quick checks
export const passwordMinSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

// ========== EMAIL VALIDATION ==========
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase()
  .trim();

// ========== PHONE VALIDATION ==========
export const phoneSchema = z
  .string()
  .optional()
  .refine(
    (val) =>
      !val ||
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(
        val
      ),
    { message: "Invalid phone number format" }
  );

// ========== LOGIN SCHEMA ==========
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ========== SIGNUP SCHEMA ==========
export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (val) => {
        const date = new Date(val);
        const now = new Date();
        const age = now.getFullYear() - date.getFullYear();
        return date < now && age >= 13; // Minimum age 13
      },
      { message: "You must be at least 13 years old" }
    ),
  role: z.enum(["ATHLETE", "COACH", "ACADEMY"]),
});

export type SignupInput = z.infer<typeof signupSchema>;

// ========== PASSWORD RESET REQUEST SCHEMA ==========
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ========== PASSWORD RESET SCHEMA ==========
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ========== PASSWORD STRENGTH CHECKER ==========
export type PasswordStrength = "weak" | "medium" | "strong" | "very-strong";

export function checkPasswordStrength(password: string): {
  strength: PasswordStrength;
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push("Use at least 8 characters");

  if (password.length >= 12) score += 1;

  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Add lowercase letters");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Add uppercase letters");

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Add numbers");

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push("Add special characters");

  // Common patterns to avoid
  if (
    /(.)\1{2,}/.test(password) ||
    /^(password|12345|qwerty|admin)/i.test(password)
  ) {
    score = Math.max(0, score - 2);
    feedback.push("Avoid common patterns");
  }

  // Determine strength
  let strength: PasswordStrength;
  if (score <= 2) strength = "weak";
  else if (score <= 3) strength = "medium";
  else if (score <= 4) strength = "strong";
  else strength = "very-strong";

  return { strength, score, feedback };
}

// ========== EMAIL VALIDATION HELPERS ==========
export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    "tempmail.com",
    "throwaway.email",
    "guerrillamail.com",
    "10minutemail.com",
    "mailinator.com",
  ];

  const domain = email.split("@")[1]?.toLowerCase();
  return disposableDomains.includes(domain);
}

// ========== VALIDATION ERROR FORMATTER ==========
export function formatZodError(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    fieldErrors[path] = err.message;
  });

  return fieldErrors;
}
