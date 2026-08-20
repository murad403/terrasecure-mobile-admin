import { z } from 'zod';

export const replyPurchaseInterestSchema = z.object({
  status: z.enum(['ACKNOWLEDGED', 'DECLINED', 'MORE_INFO_REQUESTED'], {
    message: 'Response status is required',
  }),
  message: z.string().max(5000, 'Message cannot exceed 5000 characters').optional(),
});

export type ReplyPurchaseInterestFormValues = z.infer<typeof replyPurchaseInterestSchema>;

export const createTransferPartySchema = z.object({
  ownerId: z.number().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().optional(),
  role: z.enum(['FROM', 'TO'], { message: 'Role is required' }),
  sharePercentage: z.number().min(0).max(100).optional(),
});

export const createTransferSchema = z.object({
  parcelSlug: z.string().min(1, 'Parcel slug is required'),
  transferType: z.enum(
    ['SALE', 'INHERITANCE', 'GIFT', 'COURT_ORDER', 'GOVERNMENT_ACQUISITION', 'PARTITION', 'FORECLOSURE'],
    { message: 'Transfer type is required' }
  ),
  considerationAmount: z.number().min(0, 'Amount cannot be negative').optional(),
  currency: z.string().max(10).optional(),
  effectiveDate: z.string().optional(),
  notes: z.string().max(5000).optional(),
  parties: z.array(createTransferPartySchema).optional(),
  purchaseInterestId: z.number().optional(),
});

export type CreateTransferFormValues = z.infer<typeof createTransferSchema>;

export const transferActionSchema = z.object({
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
});

export type TransferActionFormValues = z.infer<typeof transferActionSchema>;
