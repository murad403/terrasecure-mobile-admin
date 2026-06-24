"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ReviewSubmissionStepProps {
  registration: any
  onUpdate: (data: any) => void
  onCompleteStep: () => void
}

const ReviewSubmissionStep = ({ registration, onUpdate, onCompleteStep }: ReviewSubmissionStepProps) => {
  const [notes, setNotes] = useState(registration?.notes || '')

  useEffect(() => {
    setNotes(registration?.notes || '')
  }, [registration])

  const isStepCompleted = registration?.activeStep > 1

  const handleMarkReviewed = () => {
    onUpdate({
      notes,
      reviewCompleted: true
    })
    onCompleteStep()
  }

  return (
    <div className="space-y-5">
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-title">Step 1: Review Submission</h3>
          <p className="text-xs font-semibold text-subtitle mt-0.5">
            {isStepCompleted ? 'Completed' : 'In Progress'}
          </p>
        </div>

        <span
          className={cn(
            "px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider",
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-blue-50 text-blue-600 border-blue-100'
          )}
        >
          {isStepCompleted ? 'Completed' : 'In Progress'}
        </span>
      </div>

      {/* Submission Details Card */}
      <div className="bg-slate-50/20 border border-slate-100 rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-800">Submission Details</h4>
        
        <div className="divide-y divide-slate-50 font-medium text-xs">
          {/* Location row */}
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Parcel Location</span>
            <span className="text-slate-800 font-bold">{registration?.city}, {registration?.district}</span>
          </div>

          {/* Area row */}
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Area Declared</span>
            <span className="text-slate-800 font-bold font-mono">{Number(registration?.area).toLocaleString()} m²</span>
          </div>

          {/* Owner row */}
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Owner</span>
            <span className="text-slate-800 font-bold">{registration?.ownerName}</span>
          </div>
        </div>
      </div>

      {/* Notes Textarea */}
      <div className="space-y-1.5">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          rows={4}
          className="w-full p-3 border border-slate-200 bg-slate-50/20 rounded-lg text-xs md:text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all resize-none font-semibold"
        />
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={handleMarkReviewed}
          className="w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-750 hover:bg-blue-700 text-white text-xs font-bold shadow-sm rounded-lg"
        >
          Mark as Reviewed
        </Button>
      </div>
    </div>
  )
}

export default ReviewSubmissionStep