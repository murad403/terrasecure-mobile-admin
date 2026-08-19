"use client"
import React from 'react'
import { ShieldX, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUpdateParcelMutation } from '@/redux/features/parcel/parcel.api'
import { toast } from 'sonner'
import type { ParcelListItem } from '@/redux/features/parcel/parcel.type'

interface ParcelBlockModalProps {
  isOpen: boolean
  onClose: () => void
  parcelItem: ParcelListItem
}

const ParcelBlockModal: React.FC<ParcelBlockModalProps> = ({
  isOpen,
  onClose,
  parcelItem,
}) => {
  const [updateParcel, { isLoading }] = useUpdateParcelMutation()

  if (!isOpen || !parcelItem) return null

  const handleBlock = async () => {
    try {
      await updateParcel({
        id: parcelItem.id,
        data: { status: 'BLOCKED' },
      }).unwrap()

      toast.success('Land parcel blocked successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to block parcel.')
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
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Block Land Parcel</h3>
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
            Are you sure you want to block <strong className="text-slate-900">{parcelIdentifier}</strong>?
          </p>
          <p className="text-slate-500">
            Blocking this parcel will update its status to <span className="font-bold text-amber-600">BLOCKED</span> and restrict operational activities.
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
            onClick={handleBlock}
            disabled={isLoading || parcelItem.status === 'BLOCKED'}
            className="w-auto px-5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Blocking...</span>
              </div>
            ) : (
              'Block Parcel'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ParcelBlockModal