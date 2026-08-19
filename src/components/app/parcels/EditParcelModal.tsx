"use client"
import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateParcelMutation } from '@/redux/features/parcel/parcel.api'
import { toast } from 'sonner'
import type { ParcelListItem, LandParcelStatus } from '@/redux/features/parcel/parcel.type'

interface EditParcelModalProps {
  isOpen: boolean
  onClose: () => void
  parcelItem: ParcelListItem
}

const statusOptions: { label: string; value: LandParcelStatus }[] = [
  { label: 'DRAFT', value: 'DRAFT' },
  { label: 'VERIFICATION', value: 'VERIFICATION' },
  { label: 'VALIDATED', value: 'VALIDATED' },
  { label: 'PUBLISHED', value: 'PUBLISHED' },
  { label: 'RESERVED', value: 'RESERVED' },
  { label: 'SOLD', value: 'SOLD' },
  { label: 'DISPUTED', value: 'DISPUTED' },
  { label: 'BLOCKED', value: 'BLOCKED' },
]

const EditParcelModal = ({ isOpen, onClose, parcelItem }: EditParcelModalProps) => {
  const [updateParcel, { isLoading }] = useUpdateParcelMutation()

  const cleanNotes = (parcelItem.notes || '').replace(/<[^>]*>/g, '')

  const [areaSqm, setAreaSqm] = useState<string | number>(parcelItem.areaSqm ?? '')
  const [pricePerSqm, setPricePerSqm] = useState<string | number>(parcelItem.pricePerSqm ?? '')
  const [status, setStatus] = useState<LandParcelStatus>((parcelItem.status as LandParcelStatus) || 'PUBLISHED')
  const [notes, setNotes] = useState<string>(cleanNotes)

  useEffect(() => {
    if (parcelItem) {
      setAreaSqm(parcelItem.areaSqm ?? '')
      setPricePerSqm(parcelItem.pricePerSqm ?? '')
      setStatus((parcelItem.status as LandParcelStatus) || 'PUBLISHED')
      setNotes((parcelItem.notes || '').replace(/<[^>]*>/g, ''))
    }
  }, [parcelItem])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        areaSqm: areaSqm !== '' ? Number(areaSqm) : undefined,
        pricePerSqm: pricePerSqm !== '' ? Number(pricePerSqm) : undefined,
        status: status,
        notes: notes ? `<p>${notes}</p>` : undefined,
      }

      await updateParcel({ id: parcelItem.id, data: payload }).unwrap()
      toast.success('Land parcel updated successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update parcel.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Edit Parcel — {parcelItem.slug || parcelItem.parcelCode || `PCL-${parcelItem.id}`}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Update area size, price per sqm, land status, and notes
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Area Sqm & Price Per Sqm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="areaSqm" className="text-xs font-bold text-slate-700">
                  Area (sqm)
                </Label>
                <Input
                  id="areaSqm"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 1250.75"
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(e.target.value)}
                  className="w-full text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pricePerSqm" className="text-xs font-bold text-slate-700">
                  Price per sqm
                </Label>
                <Input
                  id="pricePerSqm"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 150000"
                  value={pricePerSqm}
                  onChange={(e) => setPricePerSqm(e.target.value)}
                  className="w-full text-xs font-semibold"
                />
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-bold text-slate-700">
                Land Status
              </Label>
              <Select
                value={status}
                onValueChange={(val: LandParcelStatus) => setStatus(val)}
              >
                <SelectTrigger id="status" className="w-full bg-white text-xs font-semibold">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs font-semibold">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes Textarea */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-bold text-slate-700">
                Notes
              </Label>
              <textarea
                id="notes"
                rows={4}
                placeholder="Describe land details, notes or soil quality..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:border-button-color focus:outline-none focus:ring-2 focus:ring-button-color/20 font-semibold resize-none"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-6 bg-white border-t border-slate-100 flex items-center justify-end py-4 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-auto px-5 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-auto px-6 text-xs font-bold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Parcel'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditParcelModal