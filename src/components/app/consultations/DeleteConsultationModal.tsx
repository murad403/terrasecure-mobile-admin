"use client"
import React, { useEffect } from 'react'
import { X, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LandConsultationItem } from '@/redux/features/consultations/consultations.type'

interface DeleteConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  consultation: LandConsultationItem | null
  onConfirmDelete: () => void
  isLoading?: boolean
}

const DeleteConsultationModal = ({
  isOpen,
  onClose,
  consultation,
  onConfirmDelete,
  isLoading,
}: DeleteConsultationModalProps) => {
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

  if (!isOpen || !consultation) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="bg-white rounded-2xl border border-slate-100 w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">Delete Consultation</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100">
            <Trash2 className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-sm font-bold text-slate-800">
              Delete Consultation {consultation.slug || `#${consultation.id}`}?
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Are you sure you want to delete consultation request from{' '}
              <span className="font-bold text-slate-800">
                {consultation.user?.name || 'this user'}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirmDelete}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded-lg w-auto px-5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              'Delete Consultation'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConsultationModal
