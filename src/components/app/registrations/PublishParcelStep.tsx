"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step7PublishSchema, type Step7PublishFormValues } from '@/validation/registration.validation'
import { Button } from '@/components/ui/button'
import { Check, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PublishParcelStepProps {
  registration: any
  onUpdate: (data: any) => void
  onCompleteStep: () => void
}

const PublishParcelStep = ({ registration, onUpdate, onCompleteStep }: PublishParcelStepProps) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = useForm<Step7PublishFormValues>({
    resolver: zodResolver(step7PublishSchema) as any,
    defaultValues: {}
  })

  useEffect(() => {
    reset({})
  }, [registration, reset])

  const onSubmit = () => {
    onUpdate({
      published: true,
      status: 'Completed'
    })
    onCompleteStep()
  }

  const isStepCompleted = registration?.status === 'Completed' || registration?.activeStep > 7

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-title">Step 7: Publish Parcel</h3>
          <p className="text-xs font-semibold text-subtitle mt-0.5">
            {isStepCompleted ? 'Completed' : 'Pending'}
          </p>
        </div>

        <span
          className={cn(
            "px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider",
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-amber-50 text-amber-600 border-amber-200'
          )}
        >
          {isStepCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* Info Banner Card */}
      <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-extrabold text-emerald-800 block">
            Registration approved — ready to publish
          </span>
          <span className="text-[10px] font-semibold text-emerald-650 mt-0.5 block">
            Parcel will be assigned ID CM-3193 upon publication
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span>Publish Parcel to Platform</span>
        </Button>
      </div>
    </form>
  )
}

export default PublishParcelStep