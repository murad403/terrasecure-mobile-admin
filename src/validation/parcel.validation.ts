import { z } from 'zod'

export const parcelSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  location: z.string().min(3, 'Location is required'),
  area: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ message: 'Area is required' }).positive('Area must be a positive number')
  ),
  description: z.string().optional().default(''),
  latitude: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ message: 'Latitude is required' }).min(-90, 'Min latitude is -90').max(90, 'Max latitude is 90')
  ),
  longitude: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ message: 'Longitude is required' }).min(-180, 'Min longitude is -180').max(180, 'Max longitude is 180')
  ),
  status: z.string().min(1, 'Status is required'),
  ownerName: z.string().min(1, 'Primary Owner Name is required')
})

export type ParcelFormValues = z.infer<typeof parcelSchema>

export const ownerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required')
})

export type OwnerFormValues = z.infer<typeof ownerSchema>

export const blockSchema = z.object({
  reason: z.string().min(5, 'Reason must be at least 5 characters')
})

export type BlockFormValues = z.infer<typeof blockSchema>

export const statusChangeSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  reason: z.string().min(5, 'Reason must be at least 5 characters')
})

export type StatusChangeFormValues = z.infer<typeof statusChangeSchema>
