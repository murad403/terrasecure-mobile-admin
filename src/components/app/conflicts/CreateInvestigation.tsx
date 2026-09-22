"use client"
import React, { useState, useEffect } from 'react'
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { ConflictParcel } from '@/redux/features/conflicts/conflicts.type'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CreateInvestigationProps {
  isOpen: boolean
  onClose: () => void
  conflict: ConflictParcel | null
  onCreateInvestigation?: (conflictId: number) => void
}

export const CreateInvestigation: React.FC<CreateInvestigationProps> = ({
  isOpen,
  onClose,
  conflict,
  onCreateInvestigation,
}) => {
  const [kind, setKind] = useState('OWNERSHIP_DISPUTE')
  const [priority, setPriority] = useState('HIGH')
  const [targetParcel, setTargetParcel] = useState('')
  const [assignedOfficer, setAssignedOfficer] = useState('Inspector Alain Dimi')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const conflictingSlugs = conflict?.conflicts
    ?.map((c) => c.conflictingParcel?.slug)
    .filter(Boolean) || [];

  useEffect(() => {
    if (conflict) {
      setTargetParcel(conflict.parcelCode || '')
      setDescription(`Investigation initiated for ${conflict.slug} (${conflict.parcelCode}) conflicting with: ${conflictingSlugs.join(', ') || 'N/A'}.`)
      setPriority('HIGH')
    }
    setIsSuccess(false)
  }, [conflict])

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

  if (!isOpen || !conflict) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate creation
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => {
        if (onCreateInvestigation) {
          onCreateInvestigation(conflict.id)
        }
        onClose()
      }, 1000)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-115 md:w-125 h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100 z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Create Investigation
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Initiate formal field investigation for {conflict.slug}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Investigation created successfully! Updating conflict status...</span>
            </div>
          )}

          {/* Conflict Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Target Slug</span>
              <span className="text-slate-900 font-mono font-extrabold">{conflict.slug}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Parcel Code:</span>
              <span className="font-extrabold text-blue-600 font-mono">{conflict.parcelCode}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Conflicting Slug(s):</span>
              <span className="font-bold text-slate-800">{conflictingSlugs.join(', ') || 'None'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Status & Score:</span>
              <span className="font-bold text-emerald-700">
                {conflict.status} ({conflict.reliabilityScore}% reliability)
              </span>
            </div>
          </div>

          {/* Investigation Kind / Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Investigation Kind</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="OWNERSHIP_DISPUTE">Ownership Dispute</option>
              <option value="BOUNDARY_DISPUTE">Boundary Dispute</option>
              <option value="OVERLAP_VERIFICATION">Overlap Verification</option>
              <option value="FRAUD_TITLE_FORGERY">Fraud & Title Forgery</option>
            </select>
          </div>

          {/* Priority Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Priority Level</label>
            <div className="grid grid-cols-3 gap-2">
              {['HIGH', 'MEDIUM', 'LOW'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center",
                    priority === p
                      ? p === 'HIGH'
                        ? 'bg-rose-50 border-rose-300 text-rose-700 font-extrabold shadow-sm'
                        : p === 'MEDIUM'
                        ? 'bg-amber-50 border-amber-300 text-amber-700 font-extrabold shadow-sm'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700 font-extrabold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Target Parcel Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Target Parcel Code</label>
            <input
              type="text"
              readOnly
              value={targetParcel}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-100 text-slate-700 font-mono"
            />
          </div>

          {/* Assigned Officer */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Assigned Lead Investigator</label>
            <select
              value={assignedOfficer}
              onChange={(e) => setAssignedOfficer(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Inspector Alain Dimi">Inspector Alain Dimi (Field Senior)</option>
              <option value="Marie Nkodo">Marie Nkodo (Regional Admin)</option>
              <option value="Samuel Kotto">Samuel Kotto (Cadastral Inspector)</option>
            </select>
          </div>

          {/* Description & Field Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Investigation Scope & Instructions</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter instructions for the field investigator..."
              className="w-full p-3 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* Submit / Cancel Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs font-bold px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 shadow-sm"
            >
              {isSubmitting ? 'Creating...' : 'Create Investigation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateInvestigation