"use client"
import React from 'react'
import { X, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDeleteSiteVisitMutation } from '@/redux/features/siteVisits/siteVisit.api'
import { toast } from 'sonner'

interface DeleteSiteVisitModalProps {
  isOpen: boolean
  onClose: () => void
  visitId: number | null
  visitSlug?: string
  onDeletedSuccess?: () => void
}

export const DeleteSiteVisitModal = ({
  isOpen,
  onClose,
  visitId,
  visitSlug,
  onDeletedSuccess,
}: DeleteSiteVisitModalProps) => {
  const [deleteSiteVisit, { isLoading }] = useDeleteSiteVisitMutation()

  if (!isOpen || !visitId) return null

  const handleDelete = async () => {
    try {
      const res = await deleteSiteVisit(visitId).unwrap()
      toast.success(res?.message || 'Land site visit deleted successfully!')
      onDeletedSuccess?.()
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete site visit')
    }
  }

  return (
    <div
      className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/60 backdrop-blur-[1.5px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 p-6 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Text Body */}
        <div className="space-y-2 mb-6">
          <h2 className="text-base font-extrabold text-slate-900 leading-tight">
            Delete Site Visit #{visitSlug || visitId}?
          </h2>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Are you sure you want to delete this land site visit record? This action cannot be undone and will permanently erase the visit logs.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={handleDelete}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-1.5 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 justify-center">
                <Trash2 className="w-4 h-4" />
                <span>Delete Visit</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteSiteVisitModal
