"use client"
import React, { useEffect } from 'react'
import { X, MessageSquare, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useReplyPurchaseInterestMutation } from '@/redux/features/purchase-interests/purchase-interests.api'
import {
  replyPurchaseInterestSchema,
  type ReplyPurchaseInterestFormValues,
} from '@/validation/purchase-interest.validation'

interface ReplyInterestModalProps {
  isOpen: boolean
  onClose: () => void
  interestId: number | string | null
  initialStatus?: string
  initialMessage?: string
}

const ALLOWED_STATUSES = ['ACKNOWLEDGED', 'MORE_INFO_REQUESTED', 'DECLINED']

export const ReplyInterestModal = ({
  isOpen,
  onClose,
  interestId,
  initialStatus,
  initialMessage,
}: ReplyInterestModalProps) => {
  const [replyInterest, { isLoading }] = useReplyPurchaseInterestMutation()

  const getInitialStatus = () => {
    if (initialStatus && ALLOWED_STATUSES.includes(initialStatus)) {
      return initialStatus as any
    }
    return '' as any
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyPurchaseInterestFormValues>({
    resolver: zodResolver(replyPurchaseInterestSchema),
    defaultValues: {
      status: getInitialStatus(),
      message: initialMessage || '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      reset({
        status: getInitialStatus(),
        message: initialMessage || '',
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialStatus, initialMessage, reset])

  if (!isOpen || !interestId) return null

  const onSubmit = async (values: ReplyPurchaseInterestFormValues) => {
    try {
      const res = await replyInterest({
        id: interestId,
        data: {
          status: values.status,
          message: values.message?.trim() || undefined,
        },
      }).unwrap()

      toast.success(res.message || 'Responded to purchase interest successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send response.')
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
              <MessageSquare className="w-4 h-4 text-button-color" />
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
                Reply Purchase Interest
              </h2>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
              Send official response to buyer inquiry
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
          {/* Status Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="replyStatus" className="text-xs font-bold text-slate-700 block">
              Response Action / Status <span className="text-rose-500">*</span>
            </Label>
            <select
              id="replyStatus"
              {...register('status')}
              className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-button-color cursor-pointer"
            >
              <option value="" disabled>Select status</option>
              <option value="ACKNOWLEDGED">ACKNOWLEDGED (Acknowledge Inquiry)</option>
              <option value="MORE_INFO_REQUESTED">MORE_INFO_REQUESTED (Request Additional Information)</option>
              <option value="DECLINED">DECLINED (Decline Inquiry)</option>
            </select>
            {errors.status && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.status.message}</p>
            )}
          </div>

          {/* Response Message */}
          <div className="space-y-1.5">
            <Label htmlFor="replyMsg" className="text-xs font-bold text-slate-700 block">
              Official Response Message
            </Label>
            <textarea
              id="replyMsg"
              placeholder="e.g. Thank you for your interest. We have received your inquiry and will review it shortly."
              {...register('message')}
              className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-button-color font-semibold min-h-25 leading-relaxed resize-none"
            />
            {errors.message && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.message.message}</p>
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
              className="w-1/2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Response'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReplyInterestModal
