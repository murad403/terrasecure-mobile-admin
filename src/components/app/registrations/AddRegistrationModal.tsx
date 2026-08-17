"use client"
import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateRegistrationMutation } from '@/redux/features/registrations/registration.api'
import { toast } from 'sonner'
import type { LandParcelOwnershipType, LandParcelOwnershipStatus } from '@/redux/features/registrations/registration.type'

interface RegistrantInput {
  ownerName: string
  ownerPhone: string
  sharePercentage: number
  ownershipType: LandParcelOwnershipType
  status: LandParcelOwnershipStatus
}

interface AddRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddRegistrationModal: React.FC<AddRegistrationModalProps> = ({ isOpen, onClose }) => {
  const [createRegistration, { isLoading }] = useCreateRegistrationMutation()

  const [areaSqm, setAreaSqm] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [submittedAt, setSubmittedAt] = useState<string>(new Date().toISOString().slice(0, 16))
  const [mediaIdInput, setMediaIdInput] = useState<string>('')

  const [registrants, setRegistrants] = useState<RegistrantInput[]>([
    {
      ownerName: '',
      ownerPhone: '',
      sharePercentage: 100,
      ownershipType: 'PRIMARY',
      status: 'DRAFT',
    },
  ])

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

  const handleAddRegistrant = () => {
    setRegistrants((prev) => [
      ...prev,
      {
        ownerName: '',
        ownerPhone: '',
        sharePercentage: 0,
        ownershipType: 'CO_OWNER',
        status: 'DRAFT',
      },
    ])
  }

  const handleRemoveRegistrant = (index: number) => {
    if (registrants.length === 1) {
      toast.error('At least one registrant is required.')
      return
    }
    setRegistrants((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRegistrantChange = <K extends keyof RegistrantInput>(
    index: number,
    field: K,
    value: RegistrantInput[K]
  ) => {
    setRegistrants((prev) =>
      prev.map((reg, i) => (i === index ? { ...reg, [field]: value } : reg))
    )
  }

  const totalSharePercentage = registrants.reduce(
    (sum, reg) => sum + (Number(reg.sharePercentage) || 0),
    0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (totalSharePercentage > 100) {
      toast.error(`Total share percentage cannot exceed 100%. Current total: ${totalSharePercentage}%`)
      return
    }

    for (let i = 0; i < registrants.length; i++) {
      const reg = registrants[i]
      if (!reg.ownerName.trim()) {
        toast.error(`Registrant #${i + 1} owner name is required.`)
        return
      }
      if (!reg.ownerPhone.trim()) {
        toast.error(`Registrant #${i + 1} phone number is required.`)
        return
      }
    }

    try {
      const documentsList = mediaIdInput
        ? mediaIdInput.split(',').map((id) => id.trim()).filter(Boolean)
        : []

      const payload = {
        areaSqm: areaSqm ? Number(areaSqm) : undefined,
        notes: notes ? `<p>${notes}</p>` : undefined,
        submittedAt: new Date(submittedAt).toISOString(),
        registrants: registrants.map((r) => ({
          ownerName: r.ownerName,
          ownerPhone: r.ownerPhone,
          sharePercentage: Number(r.sharePercentage) || 0,
          ownershipType: r.ownershipType,
          status: r.status,
        })),
        documents: documentsList,
      }

      await createRegistration(payload).unwrap()
      toast.success('Land parcel registration created successfully!')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create registration.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">New Registration</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Submit a new land parcel registration with multiple registrants
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Information Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">
              Parcel Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="areaSqm" className="text-xs font-bold text-slate-700">
                  Area (sqm)
                </Label>
                <Input
                  id="areaSqm"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 500.5"
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(e.target.value)}
                  className="w-full text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="submittedAt" className="text-xs font-bold text-slate-700">
                  Submission Date & Time
                </Label>
                <Input
                  id="submittedAt"
                  type="datetime-local"
                  value={submittedAt}
                  onChange={(e) => setSubmittedAt(e.target.value)}
                  className="w-full text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-bold text-slate-700">
                Notes
              </Label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Land parcel description or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:border-button-color focus:outline-none focus:ring-2 focus:ring-button-color/20 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mediaIdInput" className="text-xs font-bold text-slate-700">
                Document Media IDs (comma-separated, optional)
              </Label>
              <Input
                id="mediaIdInput"
                type="text"
                placeholder="e.g. edfaf66e-fe87-40ab-a02c-0d2f84cec8c2"
                value={mediaIdInput}
                onChange={(e) => setMediaIdInput(e.target.value)}
                className="w-full text-xs font-semibold"
              />
            </div>
          </div>

          {/* Registrants Section */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                  Registrants / Owners
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Total share percentage: {' '}
                  <span
                    className={
                      totalSharePercentage > 100
                        ? 'text-red-600 font-bold'
                        : 'text-emerald-600 font-bold'
                    }
                  >
                    {totalSharePercentage}% / 100%
                  </span>
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRegistrant}
                className="w-auto flex items-center gap-1.5 text-xs font-bold text-button-color border-button-color/30 hover:bg-button-color/5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Registrant</span>
              </Button>
            </div>

            <div className="space-y-4">
              {registrants.map((reg, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs font-bold text-slate-700">
                      Registrant #{idx + 1}
                    </span>
                    {registrants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRegistrant(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove Registrant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600">Owner Name *</Label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={reg.ownerName}
                        onChange={(e) =>
                          handleRegistrantChange(idx, 'ownerName', e.target.value)
                        }
                        className="text-xs font-semibold bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600">Owner Phone (E.164) *</Label>
                      <Input
                        type="text"
                        placeholder="+1234567890"
                        value={reg.ownerPhone}
                        onChange={(e) =>
                          handleRegistrantChange(idx, 'ownerPhone', e.target.value)
                        }
                        className="text-xs font-semibold bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600">Share %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="50"
                        value={reg.sharePercentage}
                        onChange={(e) =>
                          handleRegistrantChange(
                            idx,
                            'sharePercentage',
                            Number(e.target.value)
                          )
                        }
                        className="text-xs font-semibold bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600">Ownership Type</Label>
                      <Select
                        value={reg.ownershipType}
                        onValueChange={(val: LandParcelOwnershipType) =>
                          handleRegistrantChange(idx, 'ownershipType', val)
                        }
                      >
                        <SelectTrigger className="w-full bg-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRIMARY">PRIMARY</SelectItem>
                          <SelectItem value="CO_OWNER">CO_OWNER</SelectItem>
                          <SelectItem value="HEIR">HEIR</SelectItem>
                          <SelectItem value="LEGAL_REPRESENTATIVE">LEGAL_REPRESENTATIVE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-600">Status</Label>
                      <Select
                        value={reg.status}
                        onValueChange={(val: LandParcelOwnershipStatus) =>
                          handleRegistrantChange(idx, 'status', val)
                        }
                      >
                        <SelectTrigger className="w-full bg-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">DRAFT</SelectItem>
                          <SelectItem value="UNDER_VERIFICATION">UNDER_VERIFICATION</SelectItem>
                          <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                          <SelectItem value="RESERVED">RESERVED</SelectItem>
                          <SelectItem value="CLOSED">CLOSED</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
              {isLoading ? 'Creating...' : 'Create Registration'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRegistrationModal