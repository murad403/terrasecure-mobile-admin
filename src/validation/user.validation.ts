import { z } from 'zod'

export const userSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.string().min(1, 'Role selection is required'),
  status: z.boolean()
})

export type UserFormValues = z.infer<typeof userSchema>

