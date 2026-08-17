"use client"
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useVerifyGisDataMutation } from '@/redux/features/registrations/registration.api'
import { toast } from 'sonner'
import type { RegistrationItem, LandParcelSurveyStatus } from '@/redux/features/registrations/registration.type'

interface ApproveRejectStepProps {
  registration: RegistrationItem
  onNextStep: () => void
}

const ApproveRejectStep: React.FC<ApproveRejectStepProps> = ({
  registration,
  onNextStep,
}) => {
  const [verifyGisData, { isLoading }] = useVerifyGisDataMutation()
  const isStepCompleted = (registration.step || 1) > 6

  const targetSurvey = registration.surveys?.[0]
  const [reliabilityScore, setReliabilityScore] = useState<number>(
    targetSurvey?.reliabilityScore ?? 95
  )
  const [status, setStatus] = useState<LandParcelSurveyStatus>(
    (targetSurvey?.status === 'REJECTED' ? 'REJECTED' : 'VALIDATED') as LandParcelSurveyStatus
  )
  const [validationNotes, setValidationNotes] = useState<string>(
    targetSurvey?.validationNotes || ''
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const surveyId = targetSurvey?.id
    if (!surveyId) {
      toast.error('No survey data available to verify for this registration.')
      return
    }

    if (reliabilityScore < 0 || reliabilityScore > 100) {
      toast.error('Reliability score must be between 0 and 100.')
      return
    }

    try {
      await verifyGisData({
        id: registration.id,
        surveyId,
        data: {
          reliabilityScore: Number(reliabilityScore),
          status,
          validationNotes: validationNotes ? validationNotes.trim() : undefined,
        },
      }).unwrap()
      toast.success('GIS data verified successfully!')
      onNextStep()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to verify GIS data.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Step 6: Verify GIS Data</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {isStepCompleted ? 'Completed' : 'Validate survey reliability & status'}
          </p>
        </div>

        <span
          className={cn(
            'px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider',
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          )}
        >
          {isStepCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      {targetSurvey && (
        <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1 text-xs">
          <div className="font-bold text-slate-800">
            Survey ID: #{targetSurvey.id} · Source: {targetSurvey.source || 'MOBILE_GPS'}
          </div>
          <div className="text-slate-500">
            Computed Area: {targetSurvey.computedAreaSqm || registration.areaSqm || 0} m²
          </div>
        </div>
      )}

      {/* Reliability Score Input */}
      <div className="space-y-2">
        <Label htmlFor="reliabilityScoreInput" className="text-xs font-bold text-slate-700">
          Reliability Score (0 - 100) *
        </Label>
        <Input
          id="reliabilityScoreInput"
          type="number"
          min="0"
          max="100"
          placeholder="e.g. 95"
          value={reliabilityScore}
          onChange={(e) => setReliabilityScore(Number(e.target.value))}
          className="w-full text-xs font-semibold"
          required
        />
      </div>

      {/* Status Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="statusSelect" className="text-xs font-bold text-slate-700">
          Verification Status *
        </Label>
        <Select
          value={status}
          onValueChange={(val: LandParcelSurveyStatus) => setStatus(val)}
        >
          <SelectTrigger id="statusSelect" className="w-full text-xs">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VALIDATED">VALIDATED</SelectItem>
            <SelectItem value="REJECTED">REJECTED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Optional Validation Notes */}
      <div className="space-y-2">
        <Label htmlFor="validationNotesInput" className="text-xs font-bold text-slate-700">
          Validation Notes (Optional)
        </Label>
        <textarea
          id="validationNotesInput"
          rows={3}
          placeholder="Add any validation notes or observations..."
          value={validationNotes}
          onChange={(e) => setValidationNotes(e.target.value)}
          className="w-full p-3 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:border-button-color focus:outline-none focus:ring-2 focus:ring-button-color/20 font-semibold"
        />
      </div>

      {/* Single Action Button: Verify GIS Data */}
      <div className="pt-2">
        <Button type="submit" disabled={isLoading} className="w-auto px-6 font-bold text-xs">
          {isLoading ? 'Verifying...' : 'Verify GIS Data'}
        </Button>
      </div>
    </form>
  )
}

export default ApproveRejectStep