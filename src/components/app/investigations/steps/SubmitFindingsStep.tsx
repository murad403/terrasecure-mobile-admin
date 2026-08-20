"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useSubmitFindingsMutation } from '@/redux/features/investigations/investigations.api'
import {
  submitFindingsSchema,
  type SubmitFindingsFormValues,
} from '@/validation/investigation.validation'

interface SubmitFindingsStepProps {
  investigationId: number | string
  initialFindings?: string
  initialResolutionNotes?: string
  onSuccess?: () => void
}

export const SubmitFindingsStep = ({
  investigationId,
  initialFindings,
  initialResolutionNotes,
  onSuccess,
}: SubmitFindingsStepProps) => {
  const [submitFindings, { isLoading }] = useSubmitFindingsMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitFindingsFormValues>({
    resolver: zodResolver(submitFindingsSchema),
    defaultValues: {
      findings: initialFindings || '',
      status: 'COMPLETED',
      resolutionNotes: initialResolutionNotes || '',
    },
  })

  const onSubmit = async (values: SubmitFindingsFormValues) => {
    try {
      const res = await submitFindings({
        investigationId,
        data: {
          findings: values.findings.trim().startsWith('<p>')
            ? values.findings.trim()
            : `<p>${values.findings.trim()}</p>`,
          status: values.status,
          resolutionNotes: values.resolutionNotes?.trim()
            ? values.resolutionNotes.trim().startsWith('<p>')
              ? values.resolutionNotes.trim()
              : `<p>${values.resolutionNotes.trim()}</p>`
            : undefined,
        },
      }).unwrap()

      toast.success(res.message || 'Investigation findings submitted successfully!')
      if (onSuccess) onSuccess()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit findings.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <FileCheck className="w-4 h-4 text-button-color" />
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Step 4: Submit Findings & Observations
        </h4>
      </div>

      {/* Findings Input */}
      <div className="space-y-1.5">
        <Label htmlFor="findingsText" className="text-xs font-bold text-slate-700 block">
          Inspection Findings & Survey Results <span className="text-rose-500">*</span>
        </Label>
        <textarea
          id="findingsText"
          placeholder="Describe physical inspection, boundary markers, GPS survey accuracy..."
          {...register('findings')}
          className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-button-color font-semibold min-h-22.5 leading-relaxed resize-none"
        />
        {errors.findings && (
          <p className="text-[11px] text-rose-500 font-semibold">{errors.findings.message}</p>
        )}
      </div>

      {/* Status Selection */}
      <div className="space-y-1.5">
        <Label htmlFor="statusSelect" className="text-xs font-bold text-slate-700 block">
          Investigation Status
        </Label>
        <select
          id="statusSelect"
          {...register('status')}
          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-button-color cursor-pointer"
        >
          <option value="COMPLETED">COMPLETED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        {errors.status && (
          <p className="text-[11px] text-rose-500 font-semibold">{errors.status.message}</p>
        )}
      </div>

      {/* Resolution Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="resNotes" className="text-xs font-bold text-slate-700 block">
          Resolution Summary / Notes (Optional)
        </Label>
        <textarea
          id="resNotes"
          placeholder="Summary of recommendations and resolution steps..."
          {...register('resolutionNotes')}
          className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-button-color font-semibold min-h-17.5 leading-relaxed resize-none"
        />
        {errors.resolutionNotes && (
          <p className="text-[11px] text-rose-500 font-semibold">{errors.resolutionNotes.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full text-xs font-bold py-2 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Submitting Findings...</span>
          </div>
        ) : (
          'Submit Findings'
        )}
      </Button>
    </form>
  )
}

export default SubmitFindingsStep
