"use client"
import React, { useEffect } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Parcel } from '@/components/app/parcels/ParcelsPage'

interface DeleteParcelModalProps {
  isOpen: boolean
  onClose: () => void
  parcel: Parcel
  onDelete: () => void
}

const DeleteParcelModal = ({ isOpen, onClose, parcel, onDelete }: DeleteParcelModalProps) => {

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
          <h2 className="text-base font-bold text-title">Delete Parcel</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-6 text-center space-y-4">
          {/* Warning Icon bubble */}
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100">
            <Trash2 className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-sm font-bold text-slate-800">
              Delete Land Parcel {parcel.id}?
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-700">{parcel.name}</span>? This action is permanent and cannot be undone.
            </p>
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
            type="button"
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 rounded-lg w-auto px-5"
          >
            Delete Parcel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteParcelModal