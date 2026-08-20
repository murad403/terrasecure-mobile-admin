import { z } from 'zod';
import { LandInvestigationKind, LandInvestigationPriorityLevel } from '@/enum';

export const createInvestigationSchema = z.object({
  title: z.string().optional(),
  parcelSlug: z.string().min(1, 'Parcel selection is required'),
  kind: z.nativeEnum(LandInvestigationKind, { message: 'Dispute kind is required' }),
  priorityLevel: z.nativeEnum(LandInvestigationPriorityLevel),
  description: z.string().optional(),
});

export type CreateInvestigationFormValues = z.infer<typeof createInvestigationSchema>;
