"use client"
import React, { useEffect } from 'react'
import { X, ShieldCheck, CheckCheck, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  useVerifyTransfersMutation,
  useCompleteTransfersMutation,
} from '@/redux/features/purchase-interests/purchase-interests.api'
import {
  transferActionSchema,
  type TransferActionFormValues,
} from '@/validation/purchase-interest.validation'

interface TransferActionModalProps {
  isOpen: boolean
  onClose: () => void
  transferId: number | string | null
  actionType: 'VERIFY' | 'COMPLETE'
}

export const TransferActionModal = ({
  isOpen,
  onClose,
  transferId,
  actionType,
}: TransferActionModalProps) => {
  const [verifyTransfer, { isLoading: isVerifying }] = useVerifyTransfersMutation()
  const [completeTransfer, { isLoading: isCompleting }] = useCompleteTransfersMutation()

  const isLoading = isVerifying || isCompleting

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferActionFormValues>({
    resolver: zodResolver(transferActionSchema),
    defaultValues: {
      notes: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      reset({ notes: '' })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, reset])

  if (!isOpen || !transferId) return null

  const isVerify = actionType === 'VERIFY'

  const onSubmit = async (values: TransferActionFormValues) => {
    try {
      if (isVerify) {
        const res = await verifyTransfer({
          id: transferId,
          data: { notes: values.notes?.trim() || undefined },
        }).unwrap()
        toast.success(res.message || 'Land parcel transfer verified successfully!')
      } else {
        const res = await completeTransfer({
          id: transferId,
          data: { notes: values.notes?.trim() || undefined },
        }).unwrap()
        toast.success(res.message || 'Land parcel transfer completed successfully!')
      }
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to ${isVerify ? 'verify' : 'complete'} transfer.`)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="space-y-0.5 select-none">
            <div className="flex items-center gap-2">
              {isVerify ? (
                <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
              ) : (
                <CheckCheck className="w-4.5 h-4.5 text-emerald-600" />
              )}
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
                {isVerify ? 'Verify Land Transfer' : 'Complete Land Transfer'}
              </h2>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
              {isVerify
                ? 'Confirm and verify transfer compliance details'
                : 'Finalize transfer and issue updated land ownership records'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 select-none">
          {/* Action Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="actionNotes" className="text-xs font-bold text-slate-700 block">
              {isVerify ? 'Verification Notes / Remarks' : 'Completion Notes / Remarks'}
            </Label>
            <textarea
              id="actionNotes"
              placeholder={
                isVerify
                  ? 'Enter verification remarks (e.g. Verified compliance documents and owner identity)'
                  : 'Enter completion remarks (e.g. Final ownership transferred successfully)'
              }
              {...register('notes')}
              className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-button-color font-semibold min-h-25 leading-relaxed resize-none"
            />
            {errors.notes && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.notes.message}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 py-2.5 w-1/2 bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-1/2 cursor-pointer disabled:opacity-50 font-bold ${
                isVerify
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : isVerify ? (
                'Verify Transfer'
              ) : (
                'Complete Transfer'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransferActionModal
