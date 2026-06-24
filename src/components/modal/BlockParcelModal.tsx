"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { blockSchema, type BlockFormValues } from '@/validation/parcel.validation'
import { X, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Parcel } from '@/components/app/parcels/ParcelsPage'

interface BlockParcelModalProps {
  isOpen: boolean
  onClose: () => void
  parcel: Parcel
  onBlock: (reason: string) => void
}

const BlockParcelModal = ({ isOpen, onClose, parcel, onBlock }: BlockParcelModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      reason: ''
    }
  })

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const onSubmit = (data: BlockFormValues) => {
    onBlock(data.reason)
    reset()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="bg-white rounded-2xl border border-slate-100 w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-title">Block Parcel</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-50 p-4 border-b border-red-100 flex items-start gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-red-800">Blocking Parcel {parcel.id}</h3>
            <p className="text-[11px] text-red-700 font-medium leading-relaxed">
              Blocking this land parcel will suspend all active transactions, registry audits, and certificate transfers.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
          <div className="p-6 space-y-4">
            {/* Reason Textarea */}
            <div className="space-y-1.5">
              <Label htmlFor="block_reason">Reason for Blocking</Label>
              <textarea
                id="block_reason"
                rows={4}
                placeholder="Describe the legal case, boundary dispute, or state hold reason..."
                {...register('reason')}
                className="w-full p-3 border border-slate-200 bg-slate-50/40 rounded-lg text-xs md:text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none transition-all resize-none font-medium"
              />
              {errors.reason && (
                <p className="text-xs text-destructive font-medium mt-1">{errors.reason.message}</p>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 rounded-lg w-auto px-5"
            >
              {isSubmitting ? 'Blocking...' : 'Block Parcel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlockParcelModal