"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step3AssignSchema, type Step3AssignFormValues } from '@/validation/registration.validation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AssignSurveyorStepProps {
    registration: any
    onUpdate: (data: any) => void
    onCompleteStep: () => void
}

const AssignSurveyorStep = ({ registration, onUpdate, onCompleteStep }: AssignSurveyorStepProps) => {
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } = useForm<Step3AssignFormValues>({
        resolver: zodResolver(step3AssignSchema) as any,
        defaultValues: {
            surveyorName: registration?.surveyorName || 'Published'
        }
    })

    const surveyorNameValue = watch('surveyorName')

    useEffect(() => {
        reset({
            surveyorName: registration?.surveyorName || 'Published'
        })
    }, [registration, reset])

    const onSubmit = (data: Step3AssignFormValues) => {
        onUpdate({
            ...data,
            surveyorAssigned: true
        })
        onCompleteStep()
    }

    const isStepCompleted = registration?.activeStep > 3

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header block */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-title">Step 3: Assign Surveyor</h3>
                    <p className="text-xs font-semibold text-subtitle mt-0.5">
                        {isStepCompleted ? 'Completed' : 'Currently in progress'}
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

            {/* Surveyor Dropdown */}
            <div className="space-y-2">
                <Label htmlFor="surveyorName" className="text-xs font-bold text-slate-700">Select Surveyor</Label>
                <Select
                    value={surveyorNameValue}
                    onValueChange={(val) => setValue('surveyorName', val as any, { shouldValidate: true, shouldDirty: true })}
                >
                    <SelectTrigger id="surveyorName" className="w-full">
                        <SelectValue placeholder="Select Surveyor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Jean Alima">Jean Alima (Senior Surveyor)</SelectItem>
                        <SelectItem value="Sarah Admin">Sarah Admin (GIS Specialist)</SelectItem>
                        <SelectItem value="Supervisor Paul">Supervisor Paul (District Chief)</SelectItem>
                    </SelectContent>
                </Select>                {errors.surveyorName && (
                    <p className="text-xs text-destructive font-semibold mt-1">{errors.surveyorName.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className='w-auto'
                >
                    {isSubmitting ? 'Assigning...' : 'Assign Surveyor'}
                </Button>
            </div>
        </form>
    )
}

export default AssignSurveyorStep