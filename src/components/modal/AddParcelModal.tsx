"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parcelSchema, type ParcelFormValues } from '@/validation/parcel.validation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddParcelModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: ParcelFormValues) => void
}

const AddParcelModal = ({ isOpen, onClose, onAdd }: AddParcelModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ParcelFormValues>({
    resolver: zodResolver(parcelSchema) as any,
    defaultValues: {
      name: '',
      location: '',
      area: '' as any,
      description: '',
      latitude: '' as any,
      longitude: '' as any,
      status: 'Pending',
      ownerName: ''
    }
  })

  // Lock scroll when open
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

  const onSubmit = (data: ParcelFormValues) => {
    onAdd(data)
    reset()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="bg-white rounded-2xl border border-slate-100 w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-title">Add New Parcel</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Grid fields */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Parcel Name */}
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="name">Parcel Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Bastos Estate Plot A"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Location */}
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="location">Location / Zone</Label>
                <Input
                  id="location"
                  placeholder="e.g. Bastos, Yaoundé"
                  {...register('location')}
                />
                {errors.location && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.location.message}</p>
                )}
              </div>

              {/* Area */}
              <div className="space-y-1.5">
                <Label htmlFor="area">Total Area (sqm)</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="e.g. 1200"
                  {...register('area')}
                />
                {errors.area && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.area.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label htmlFor="status">Initial Status</Label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title focus:outline-none focus:border-button-color transition-colors"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Disputed">Disputed</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Validated">Validated</option>
                </select>
                {errors.status && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.status.message}</p>
                )}
              </div>

              {/* Latitude */}
              <div className="space-y-1.5">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 3.8964"
                  {...register('latitude')}
                />
                {errors.latitude && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.latitude.message}</p>
                )}
              </div>

              {/* Longitude */}
              <div className="space-y-1.5">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 11.5126"
                  {...register('longitude')}
                />
                {errors.longitude && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.longitude.message}</p>
                )}
              </div>

              {/* Primary Owner Name */}
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="ownerName">Primary Owner Name</Label>
                <Input
                  id="ownerName"
                  placeholder="e.g. Jean Alima"
                  {...register('ownerName')}
                />
                {errors.ownerName && (
                  <p className="text-xs text-destructive font-medium mt-1">{errors.ownerName.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="description">Land Description</Label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Describe the boundaries, landmarks or usage..."
                  {...register('description')}
                  className="w-full p-3 border border-slate-200 bg-slate-50/40 rounded-lg text-xs md:text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none transition-all resize-none font-medium"
                />
              </div>

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
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 rounded-lg w-auto px-5"
            >
              {isSubmitting ? 'Creating...' : 'Add Parcel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddParcelModal