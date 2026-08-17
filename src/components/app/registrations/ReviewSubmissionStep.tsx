"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { RegistrationItem } from '@/redux/features/registrations/registration.type'

interface ReviewSubmissionStepProps {
  registration: RegistrationItem
  onNextStep: () => void
}

const ReviewSubmissionStep: React.FC<ReviewSubmissionStepProps> = ({
  registration,
  onNextStep,
}) => {
  const isStepCompleted = (registration.step || 1) > 1

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A'
    const parsed = new Date(dateStr)
    if (isNaN(parsed.getTime())) return 'N/A'
    return parsed.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const primaryOwner = registration.registrants?.[0]
  const location = registration.location

  return (
    <div className="space-y-5">
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Step 1: Review Submission</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {isStepCompleted ? 'Completed' : 'Pending Admin Review'}
          </p>
        </div>

        <span
          className={cn(
            'px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider',
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-blue-50 text-blue-600 border-blue-100'
          )}
        >
          {isStepCompleted ? 'Completed' : 'In Progress'}
        </span>
      </div>

      {/* Submission Details Card */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Registration Overview
        </h4>

        <div className="divide-y divide-slate-100 font-medium text-xs">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Registration Slug</span>
            <span className="text-slate-800 font-bold font-mono">{registration.slug || `REG-${registration.id}`}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Status</span>
            <span className="text-slate-800 font-bold">{registration.status}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Area (sqm)</span>
            <span className="text-slate-800 font-bold font-mono">
              {registration.areaSqm ? `${Number(registration.areaSqm).toLocaleString()} m²` : 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Submitted At</span>
            <span className="text-slate-800 font-bold">
              {formatDate(registration.submittedAt || registration.createdAt)}
            </span>
          </div>

          {location && (
            <div className="py-2 space-y-1">
              <span className="text-slate-500 block">Location Details</span>
              <p className="text-slate-800 font-semibold text-xs leading-relaxed">
                {[location.addressLine1, location.addressLine2, location.city, location.state, location.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {location.remarks && (
                <p className="text-slate-500 text-[11px] italic">Remarks: {location.remarks}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Registrants / Owners Section */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Registrants ({registration.registrants?.length || 0})
        </h4>

        {registration.registrants && registration.registrants.length > 0 ? (
          <div className="space-y-2">
            {registration.registrants.map((reg, idx) => (
              <div key={idx} className="p-3 bg-white border border-slate-200/60 rounded-lg text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{reg.ownerName}</div>
                  <div className="text-[11px] text-slate-500">{reg.ownerPhone}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">
                    {reg.ownershipType || 'PRIMARY'} · {reg.sharePercentage || 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No registrants associated.</p>
        )}
      </div>

      {/* Notes (Read-Only HTML / Text) */}
      {registration.notes && (
        <div className="space-y-1.5 bg-slate-50/50 border border-slate-100 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Notes / Description
          </h4>
          <div
            className="text-xs text-slate-700 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: registration.notes }}
          />
        </div>
      )}

      {/* Action Button */}
      <div className="pt-2">
        <Button type="button" onClick={onNextStep} className="w-auto px-6">
          Mark as Reviewed
        </Button>
      </div>
    </div>
  )
}

export default ReviewSubmissionStep