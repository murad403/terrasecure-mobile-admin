"use client"
import React from 'react'
import { Trash2, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDeleteParcelMutation } from '@/redux/features/parcel/parcel.api'
import { toast } from 'sonner'
import type { ParcelListItem } from '@/redux/features/parcel/parcel.type'

interface ParcelDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  parcelItem: ParcelListItem
}

const ParcelDeleteModal: React.FC<ParcelDeleteModalProps> = ({
  isOpen,
  onClose,
  parcelItem,
}) => {
  const [deleteParcel, { isLoading }] = useDeleteParcelMutation()

  if (!isOpen || !parcelItem) return null

  const handleDelete = async () => {
    try {
      await deleteParcel(parcelItem.id).unwrap()
      toast.success('Land parcel deleted successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete parcel.')
    }
  }

  const parcelIdentifier = parcelItem.slug || parcelItem.parcelCode || `PCL-${parcelItem.id}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl p-6 flex flex-col text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Delete Land Parcel</h3>
              <p className="text-xs text-slate-500 font-medium">{parcelIdentifier}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-2 text-xs font-semibold text-slate-600">
          <p>
            Are you sure you want to delete parcel <strong className="text-slate-900">{parcelIdentifier}</strong>?
          </p>
          <p className="text-rose-600 font-medium">
            This action will mark the land parcel as deleted and cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-auto px-4 text-xs font-bold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-auto px-5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              'Delete Parcel'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ParcelDeleteModal