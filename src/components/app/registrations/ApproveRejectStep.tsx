"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step6ApproveSchema, type Step6ApproveFormValues } from '@/validation/registration.validation'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ApproveRejectStepProps {
  registration: any
  onUpdate: (data: any) => void
  onCompleteStep: () => void
}

const ApproveRejectStep = ({ registration, onUpdate, onCompleteStep }: ApproveRejectStepProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm<Step6ApproveFormValues>({
    resolver: zodResolver(step6ApproveSchema) as any,
    defaultValues: {
      reliabilityScore: registration?.reliabilityScore || 'Very High',
      comments: registration?.comments || ''
    }
  })

  useEffect(() => {
    reset({
      reliabilityScore: registration?.reliabilityScore || 'Very High',
      comments: registration?.comments || ''
    })
  }, [registration, reset])

  const handleDecisionSubmit = (verdict: 'Approved' | 'Rejected') => {
    handleSubmit((data) => {
      onUpdate({
        reliabilityScore: data.reliabilityScore,
        decision: verdict,
        comments: data.comments || '',
        decisionSubmitted: true,
        status: verdict === 'Approved' ? 'In Progress' : 'Rejected'
      })
      onCompleteStep()
    })()
  }

  const isStepCompleted = registration?.activeStep > 6

  return (
    <div className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-title">Step 6: Approve / Reject</h3>
          <p className="text-xs font-semibold text-subtitle mt-0.5">
            {isStepCompleted ? 'Completed' : 'Pending'}
          </p>
        </div>

        <span
          className={cn(
            "px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider",
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          )}
        >
          {isStepCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* Reliability Score */}
      <div className="space-y-2">
        <Label htmlFor="reliabilityScore" className="text-xs font-bold text-slate-700">Reliability Score</Label>
        <select
          id="reliabilityScore"
          {...register('reliabilityScore')}
          className="w-full px-3.5 py-2.5 border border-slate-200 bg-white rounded-lg text-xs md:text-sm text-title focus:outline-none focus:border-button-color focus:ring-2 focus:ring-button-color/20 transition-none font-semibold leading-relaxed cursor-pointer"
        >
          <option value="Very High">Very High</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {errors.reliabilityScore && (
          <p className="text-xs text-destructive font-semibold mt-1">{errors.reliabilityScore.message}</p>
        )}
      </div>

      {/* Approve / Reject Actions Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleDecisionSubmit('Approved')}
          className="flex items-center justify-center gap-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] shadow-sm cursor-pointer transition-colors whitespace-nowrap"
        >
          ✓ Approve Registration
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleDecisionSubmit('Rejected')}
          className="flex items-center justify-center gap-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] shadow-sm cursor-pointer transition-colors whitespace-nowrap"
        >
          ✗ Reject Registration
        </button>
      </div>

      {/* Comments Box */}
      <div className="space-y-2 pt-1">
        <textarea
          id="comments"
          rows={4}
          placeholder="Rejection reason (if applicable)..."
          {...register('comments')}
          className="w-full p-3.5 border border-slate-200 bg-white rounded-lg text-xs md:text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:outline-none transition-all resize-none font-semibold"
        />
        {errors.comments && (
          <p className="text-xs text-destructive font-semibold mt-1">{errors.comments.message}</p>
        )}
      </div>
    </div>
  )
}

export default ApproveRejectStep