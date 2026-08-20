"use client"
import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Gavel, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useSubmitFinalDecisionMutation } from '@/redux/features/investigations/investigations.api'
import {
  finalizeDecisionSchema,
  type FinalizeDecisionFormValues,
} from '@/validation/investigation.validation'
import type { LandInvestigationDecision } from '@/redux/features/investigations/investigations.type'

interface FinalizeDecisionStepProps {
  investigationId: number | string
  initialResolutionNotes?: string
  onSuccess?: () => void
}

const DECISION_OPTIONS: { label: string; value: LandInvestigationDecision }[] = [
  { label: 'Close Investigation (Resolved)', value: 'CLOSE' },
  { label: 'Set Parcel as Disputed', value: 'SET_PARCEL_DISPUTED' },
  { label: 'Set Parcel as Blocked', value: 'SET_PARCEL_BLOCKED' },
  { label: 'Create Conflict Record', value: 'CREATE_CONFLICT' },
  { label: 'Force New Survey', value: 'FORCE_NEW_SURVEY' },
  { label: 'Initiate Legal Process', value: 'LEGAL_PROCESS' },
]

export const FinalizeDecisionStep = ({
  investigationId,
  initialResolutionNotes,
  onSuccess,
}: FinalizeDecisionStepProps) => {
  const [submitFinalDecision, { isLoading }] = useSubmitFinalDecisionMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FinalizeDecisionFormValues>({
    resolver: zodResolver(finalizeDecisionSchema),
    defaultValues: {
      decision: 'CLOSE',
      resolutionNotes: initialResolutionNotes || '',
    },
  })

  const selectedDecision = useWatch({ control, name: 'decision' })

  const onSubmit = async (values: FinalizeDecisionFormValues) => {
    try {
      const payload = {
        decision: values.decision,
        resolutionNotes: values.resolutionNotes.trim(),
        conflictKind: values.decision === 'CREATE_CONFLICT' ? values.conflictKind : undefined,
        conflictingParcelSlug:
          values.decision === 'CREATE_CONFLICT' && values.conflictingParcelSlug?.trim()
            ? values.conflictingParcelSlug.trim()
            : undefined,
        legalCaseReference:
          values.decision === 'LEGAL_PROCESS' && values.legalCaseReference?.trim()
            ? values.legalCaseReference.trim()
            : undefined,
      }

      const res = await submitFinalDecision({
        investigationId,
        data: payload,
      }).unwrap()

      toast.success(res.message || 'Final decision applied successfully!')
      if (onSuccess) onSuccess()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit final decision.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <Gavel className="w-4 h-4 text-button-color" />
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Step 5: Finalize Investigation & Apply Decision
        </h4>
      </div>

      {/* Decision Selection */}
      <div className="space-y-1.5">
        <Label htmlFor="decisionSelect" className="text-xs font-bold text-slate-700 block">
          Final Decision Action <span className="text-rose-500">*</span>
        </Label>
        <select
          id="decisionSelect"
          {...register('decision')}
          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-button-color cursor-pointer"
        >
          {DECISION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.decision && (
          <p className="text-[11px] text-rose-500 font-semibold">{errors.decision.message}</p>
        )}
      </div>

      {/* Conditional Fields for CREATE_CONFLICT */}
      {selectedDecision === 'CREATE_CONFLICT' && (
        <div className="space-y-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
          <div className="space-y-1.5">
            <Label htmlFor="conflictKindSelect" className="text-xs font-bold text-slate-700 block">
              Conflict Kind <span className="text-rose-500">*</span>
            </Label>
            <select
              id="conflictKindSelect"
              {...register('conflictKind')}
              className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-button-color cursor-pointer"
            >
              <option value="">Select conflict kind...</option>
              <option value="OVERLAP">OVERLAP</option>
              <option value="DUPLICATE">DUPLICATE</option>
              <option value="BOUNDARY_DISPUTE">BOUNDARY_DISPUTE</option>
              <option value="INVALID_GEOMETRY">INVALID_GEOMETRY</option>
            </select>
            {errors.conflictKind && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.conflictKind.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="conflictingSlug" className="text-xs font-bold text-slate-700 block">
              Conflicting Parcel Slug (Optional)
            </Label>
            <Input
              id="conflictingSlug"
              placeholder="e.g. NEW-DR5REG-0001M"
              {...register('conflictingParcelSlug')}
              className="font-semibold text-xs text-slate-900 bg-white"
            />
            {errors.conflictingParcelSlug && (
              <p className="text-[11px] text-rose-500 font-semibold">
                {errors.conflictingParcelSlug.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Conditional Fields for LEGAL_PROCESS */}
      {selectedDecision === 'LEGAL_PROCESS' && (
        <div className="space-y-1.5 p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
          <Label htmlFor="legalRef" className="text-xs font-bold text-slate-700 block">
            Legal Case Reference Number (Optional)
          </Label>
          <Input
            id="legalRef"
            placeholder="e.g. COURT-REF-2026-88"
            {...register('legalCaseReference')}
            className="font-semibold text-xs text-slate-900 bg-white"
          />
          {errors.legalCaseReference && (
            <p className="text-[11px] text-rose-500 font-semibold">
              {errors.legalCaseReference.message}
            </p>
          )}
        </div>
      )}

      {/* Resolution Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="finalNotes" className="text-xs font-bold text-slate-700 block">
          Final Resolution Notes & Justification <span className="text-rose-500">*</span>
        </Label>
        <textarea
          id="finalNotes"
          placeholder="Explain the final decision, legal justification, or resolution rationale..."
          {...register('resolutionNotes')}
          className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-button-color font-semibold min-h-22.5 leading-relaxed resize-none"
        />
        {errors.resolutionNotes && (
          <p className="text-[11px] text-rose-500 font-semibold">{errors.resolutionNotes.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full text-xs font-bold py-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Finalizing Decision...</span>
          </div>
        ) : (
          'Apply Final Decision'
        )}
      </Button>
    </form>
  )
}

export default FinalizeDecisionStep
