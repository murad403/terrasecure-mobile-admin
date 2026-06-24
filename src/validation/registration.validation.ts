import { z } from 'zod'

export const addRegistrationSchema = z.object({
  ownerName: z.string().min(3, 'Applicant name must be at least 3 characters'),
  nationalId: z.string().min(6, 'Applicant National ID must be at least 6 characters'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  area: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ message: 'Area is required' }).positive('Area must be a positive number')
  ),
  submissionDate: z.string().min(1, 'Submission date is required'),
  notes: z.string().optional().default('')
})

export type AddRegistrationFormValues = z.infer<typeof addRegistrationSchema>

export const step1ReviewSchema = z.object({
  ownerName: z.string().min(3, 'Owner name must be at least 3 characters'),
  nationalId: z.string().min(6, 'National ID must be at least 6 characters'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  email: z.string().email('Invalid email address'),
  parcelName: z.string().min(3, 'Parcel name must be at least 3 characters'),
  location: z.string().min(3, 'Location is required'),
  area: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ message: 'Area is required' }).positive('Area must be a positive number')
  ),
  description: z.string().optional().default('')
})

export type Step1ReviewFormValues = z.infer<typeof step1ReviewSchema>

export const step3AssignSchema = z.object({
  surveyorName: z.string().min(1, 'Surveyor selection is required')
})

export type Step3AssignFormValues = z.infer<typeof step3AssignSchema>

export const step4VisitSchema = z.object({
  visitDateTime: z.string().min(1, 'Visit date & time is required')
})

export type Step4VisitFormValues = z.infer<typeof step4VisitSchema>

export const step5GisSchema = z.object({
  latitude: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ message: 'Latitude is required' }).min(-90, 'Min latitude is -90').max(90, 'Max latitude is 90')
  ),
  longitude: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ message: 'Longitude is required' }).min(-180, 'Min longitude is -180').max(180, 'Max longitude is 180')
  ),
  accuracy: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ message: 'Accuracy is required' }).positive('Accuracy must be positive')
  )
})

export type Step5GisFormValues = z.infer<typeof step5GisSchema>

export const step6ApproveSchema = z.object({
  decision: z.enum(['Approved', 'Rejected'], { message: 'Decision is required' }),
  comments: z.string().min(5, 'Reviewer comments must be at least 5 characters')
})

export type Step6ApproveFormValues = z.infer<typeof step6ApproveSchema>

export const step7PublishSchema = z.object({
  volume: z.string().min(1, 'Registry volume is required'),
  folio: z.string().min(1, 'Folio / Page Number is required'),
  registryDate: z.string().min(1, 'Registry date is required'),
  visibility: z.string().min(1, 'Visibility selection is required')
})

export type Step7PublishFormValues = z.infer<typeof step7PublishSchema>
