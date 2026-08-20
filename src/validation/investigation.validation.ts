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

export const assignInvestigatorSchema = z.object({
  investigatorId: z
    .number({ message: 'Investigator is required' })
    .int('investigatorId must be an integer')
    .positive('investigatorId must be a positive integer'),
});


export type AssignInvestigatorFormValues = z.infer<typeof assignInvestigatorSchema>;

export const attachEvidenceSchema = z.object({
  mediaId: z.string().min(1, 'Media ID is required'),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional(),
});

export type AttachEvidenceFormValues = z.infer<typeof attachEvidenceSchema>;

export const submitFindingsSchema = z.object({
  findings: z.string().min(5, 'Findings report is required'),
  status: z
    .enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED', 'REJECTED', 'CLOSED'])
    .optional(),
  resolutionNotes: z.string().max(2000, 'Resolution notes must be at most 2000 characters').optional(),
});

export type SubmitFindingsFormValues = z.infer<typeof submitFindingsSchema>;

export const finalizeDecisionSchema = z
  .object({
    decision: z.enum([
      'CLOSE',
      'SET_PARCEL_DISPUTED',
      'SET_PARCEL_BLOCKED',
      'CREATE_CONFLICT',
      'FORCE_NEW_SURVEY',
      'LEGAL_PROCESS',
    ], { message: 'Final decision is required' }),
    resolutionNotes: z
      .string()
      .trim()
      .min(1, 'Resolution notes are required')
      .max(2000, 'Resolution notes must be at most 2000 characters'),
    conflictKind: z.enum(['OVERLAP', 'DUPLICATE', 'BOUNDARY_DISPUTE', 'INVALID_GEOMETRY']).optional(),
    conflictingParcelSlug: z.string().optional(),
    legalCaseReference: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.decision === 'CREATE_CONFLICT' && !val.conflictKind) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['conflictKind'],
        message: 'conflictKind is required when decision is CREATE_CONFLICT',
      });
    }
  });

export type FinalizeDecisionFormValues = z.infer<typeof finalizeDecisionSchema>;
