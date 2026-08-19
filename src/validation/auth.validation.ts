import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})
export type SignInFormValues = z.infer<typeof signInSchema>


export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
})
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>



export const verifyOtpSchema = z.object({
  otp: z.string().length(6, "Verification code must be exactly 6 digits").regex(/^\d+$/, "Code must contain only numbers"),
})
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>


export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirmation do not match",
  path: ["confirmPassword"],
})

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

