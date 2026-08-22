"use client"
import React, { useState } from 'react'
import { X, Plus, Compass, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCreateSurveyMutation } from '@/redux/features/survey/survey.api'
import { ParcelPicker } from '@/components/tools/ParcelPicker'
import { RegistrationPicker } from '@/components/tools/RegistrationPicker'
import type { ParcelListItem } from '@/redux/features/parcel/parcel.type'
import type { RegistrationItem } from '@/redux/features/registrations/registration.type'

interface CreateSurveyModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateSurveyModal: React.FC<CreateSurveyModalProps> = ({ isOpen, onClose }) => {
  const [linkType, setLinkType] = useState<'registration' | 'parcel'>('registration')
  const [selectedRegistrations, setSelectedRegistrations] = useState<RegistrationItem[]>([])
  const [selectedParcels, setSelectedParcels] = useState<ParcelListItem[]>([])

  const [createSurvey, { isLoading }] = useCreateSurveyMutation()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: { registrationId?: number; parcelId?: number } = {}

    if (linkType === 'registration') {
      const regId = selectedRegistrations.length > 0 ? selectedRegistrations[0].id : null
      if (!regId) {
        toast.warning('Please select a Land Registration.')
        return
      }
      payload.registrationId = regId
    } else {
      const parcId = selectedParcels.length > 0 ? selectedParcels[0].id : null
      if (!parcId) {
        toast.warning('Please select a Parcel.')
        return
      }
      payload.parcelId = Number(parcId)
    }

    try {
      const res = await createSurvey(payload).unwrap()
      toast.success(res.message || 'Land parcel survey created successfully!')
      setSelectedRegistrations([])
      setSelectedParcels([])
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create land parcel survey.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-100 rounded-2xl w-full max-w-md shadow-2xl overflow-visible animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white rounded-t-2xl select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-button-color/10 flex items-center justify-center text-button-color font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Create New Survey</h2>
              <p className="text-[11px] text-slate-500">Initialize a survey linked to a registration or parcel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Link Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Link Survey To</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLinkType('registration')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  linkType === 'registration'
                    ? 'bg-button-color/10 border-button-color text-button-color ring-2 ring-button-color/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Land Registration
              </button>

              <button
                type="button"
                onClick={() => setLinkType('parcel')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  linkType === 'parcel'
                    ? 'bg-button-color/10 border-button-color text-button-color ring-2 ring-button-color/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Existing Parcel
              </button>
            </div>
          </div>

          {/* Registration Picker */}
          {linkType === 'registration' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Select Land Registration</label>
              <RegistrationPicker
                value={selectedRegistrations}
                onChange={(items) => setSelectedRegistrations(items)}
                type="radio"
                placeholder="Search registration by slug/id..."
              />
            </div>
          )}

          {/* Parcel Picker */}
          {linkType === 'parcel' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Select Parcel</label>
              <ParcelPicker
                value={selectedParcels}
                onChange={(parcels) => setSelectedParcels(parcels)}
                type="radio"
                placeholder="Search parcels..."
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" className='w-auto' onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2 w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Survey</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSurveyModal
