"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step6ApproveSchema, type Step6ApproveFormValues } from '@/validation/registration.validation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react'

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
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<Step6ApproveFormValues>({
    resolver: zodResolver(step6ApproveSchema),
    defaultValues: {
      decision: registration?.decision || undefined,
      comments: registration?.comments || ''
    }
  })

  useEffect(() => {
    reset({
      decision: registration?.decision || undefined,
      comments: registration?.comments || ''
    })
  }, [registration, reset])

  const decision = watch('decision')

  const onSubmit = (data: Step6ApproveFormValues) => {
    onUpdate({
      ...data,
      decisionSubmitted: true,
      status: data.decision === 'Approved' ? 'Approving' : 'Rejected'
    })
    onCompleteStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-title">Approve / Reject Registration</h3>
        <p className="text-xs font-semibold text-subtitle mt-0.5">Record the final committee assessment. Approved registrations progress to public registry publishing.</p>
      </div>

      <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 space-y-5">
        
        {/* Decision Toggle */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Committee Verdict</Label>
          
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setValue('decision', 'Approved')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                decision === 'Approved'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve Application</span>
            </button>

            <button
              type="button"
              onClick={() => setValue('decision', 'Rejected')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                decision === 'Rejected'
                  ? 'bg-rose-50 border-rose-300 text-rose-755 text-rose-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Reject Application</span>
            </button>
          </div>
          {errors.decision && (
            <p className="text-xs text-destructive font-semibold mt-1">{errors.decision.message}</p>
          )}
        </div>

        {/* Comments Box */}
        <div className="space-y-1.5">
          <Label htmlFor="comments" className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>Reviewer Findings & Decision Notes</span>
          </Label>
          <textarea
            id="comments"
            rows={4}
            placeholder="Document detailed findings, meeting date, boundary confirmation details, or reasons for rejection..."
            {...register('comments')}
            className="w-full p-3 border border-slate-200 bg-white rounded-lg text-xs md:text-sm text-title placeholder:text-slate-400 focus:border-button-color focus:outline-none transition-all resize-none font-semibold"
          />
          {errors.comments && (
            <p className="text-xs text-destructive font-semibold mt-1">{errors.comments.message}</p>
          )}
        </div>

      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 text-white text-sm font-bold transition-all ${
            decision === 'Rejected'
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-button-color hover:bg-button-color/90'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Final Verdict'}
        </Button>
      </div>
    </form>
  )
}

export default ApproveRejectStep