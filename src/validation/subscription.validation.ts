import { z } from 'zod'

export const planSchema = z.object({
  icon: z.string().min(1, 'Please select an icon'),
  name: z.string().min(3, 'Plan name must be at least 3 characters'),
  unlocksDescription: z.string().min(3, 'Unlocks description must be at least 3 characters'),
  price: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number({ message: 'Price must be a valid number' }).nonnegative('Price must be a positive number')
  ),
  currency: z.string().min(1, 'Currency is required'),
  period: z.string().min(1, 'Period is required'),
  badgeLabel: z.string().optional().default(''),
  badgeColor: z.string().optional().default('orange'),
  features: z.array(
    z.object({
      text: z.string().min(1, 'Feature description cannot be empty'),
      enabled: z.boolean().default(true)
    })
  ).min(1, 'At least one feature is required'),
  displayOrder: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number({ message: 'Display order must be an integer' }).int()
  ),
  isActive: z.boolean().default(true)
})

export type PlanFormValues = z.infer<typeof planSchema>

export const promoBannerSchema = z.object({
  labelPill: z.string().min(1, 'Label pill is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  title: z.string().min(1, 'Title is required'),
  isActive: z.boolean().default(true)
})

export type PromoBannerFormValues = z.infer<typeof promoBannerSchema>
