"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step4VisitSchema, type Step4VisitFormValues } from '@/validation/registration.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ScheduleFieldVisitStepProps {
    registration: any
    onUpdate: (data: any) => void
    onCompleteStep: () => void
}

const ScheduleFieldVisitStep = ({ registration, onUpdate, onCompleteStep }: ScheduleFieldVisitStepProps) => {
    const getInitialDateTime = () => {
        if (registration?.visitDateTime) return registration.visitDateTime
        if (registration?.visitDate && registration?.visitTime) {
            return `${registration.visitDate}T${registration.visitTime}`
        }
        return ''
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<Step4VisitFormValues>({
        resolver: zodResolver(step4VisitSchema) as any,
        defaultValues: {
            visitDateTime: getInitialDateTime()
        }
    })

    useEffect(() => {
        reset({
            visitDateTime: getInitialDateTime()
        })
    }, [registration, reset])

    const onSubmit = (data: Step4VisitFormValues) => {
        const [date, time] = data.visitDateTime.split('T')
        onUpdate({
            visitDateTime: data.visitDateTime,
            visitDate: date || '',
            visitTime: time || '',
            visitScheduled: true
        })
        onCompleteStep()
    }

    const isStepCompleted = registration?.activeStep > 4

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header block */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-title">Step 4: Schedule Field Visit</h3>
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

            {/* Date Time Picker */}
            <div className="space-y-2">
                <Label htmlFor="visitDateTime" className="text-xs font-bold text-slate-700">Schedule Date & Time</Label>
                <Input
                    id="visitDateTime"
                    type="datetime-local"
                    {...register('visitDateTime')}
                    className="w-full px-3.5 py-2.5 border border-slate-200 bg-white rounded-lg text-xs md:text-sm text-title focus:outline-none focus:border-button-color focus:ring-2 focus:ring-button-color/20 transition-none font-semibold cursor-pointer"
                />
                {errors.visitDateTime && (
                    <p className="text-xs text-destructive font-semibold mt-1">{errors.visitDateTime.message}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm rounded-lg w-fit cursor-pointer"
                >
                    {isSubmitting ? 'Scheduling...' : 'Schedule Visit'}
                </Button>
                <Button
                    type="button"
                    className="px-6 py-2.5 w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border-none text-xs font-bold shadow-sm rounded-lg cursor-pointer"
                    onClick={() => alert("Notification sent to surveyor!")}
                >
                    Notify Surveyor
                </Button>
            </div>
        </form>
    )
}

export default ScheduleFieldVisitStep