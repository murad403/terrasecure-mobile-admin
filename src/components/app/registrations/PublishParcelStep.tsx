"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step7PublishSchema, type Step7PublishFormValues } from '@/validation/registration.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Calendar, Shield } from 'lucide-react'

interface PublishParcelStepProps {
  registration: any
  onUpdate: (data: any) => void
  onCompleteStep: () => void
}

const PublishParcelStep = ({ registration, onUpdate, onCompleteStep }: PublishParcelStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<Step7PublishFormValues>({
    resolver: zodResolver(step7PublishSchema) as any,
    defaultValues: {
      volume: registration?.volume || '',
      folio: registration?.folio || '',
      registryDate: registration?.registryDate || '',
      visibility: registration?.visibility || 'Public'
    }
  })

  useEffect(() => {
    reset({
      volume: registration?.volume || '',
      folio: registration?.folio || '',
      registryDate: registration?.registryDate || '',
      visibility: registration?.visibility || 'Public'
    })
  }, [registration, reset])

  const onSubmit = (data: Step7PublishFormValues) => {
    onUpdate({
      ...data,
      published: true,
      status: 'Published'
    })
    onCompleteStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-title">Publish Parcel</h3>
        <p className="text-xs font-semibold text-subtitle mt-0.5">Commit this land parcel record into the public registry database. Generates the final digital title.</p>
      </div>

      <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 space-y-4">
        
        {/* Book / Volume Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="volume" className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Registry Volume</span>
            </Label>
            <Input
              id="volume"
              placeholder="e.g. Vol-84B"
              {...register('volume')}
            />
            {errors.volume && (
              <p className="text-xs text-destructive font-semibold mt-1">{errors.volume.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="folio" className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Folio / Page No.</span>
            </Label>
            <Input
              id="folio"
              placeholder="e.g. Folio-104"
              {...register('folio')}
            />
            {errors.folio && (
              <p className="text-xs text-destructive font-semibold mt-1">{errors.folio.message}</p>
            )}
          </div>
        </div>

        {/* Registry Date */}
        <div className="space-y-1.5">
          <Label htmlFor="registryDate" className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Registry Date</span>
          </Label>
          <Input
            id="registryDate"
            type="date"
            {...register('registryDate')}
            className="transition-none"
          />
          {errors.registryDate && (
            <p className="text-xs text-destructive font-semibold mt-1">{errors.registryDate.message}</p>
          )}
        </div>

        {/* Access Visibility */}
        <div className="space-y-1.5">
          <Label htmlFor="visibility" className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Public Access Level</span>
          </Label>
          <select
            id="visibility"
            {...register('visibility')}
            className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm text-title focus:outline-none focus:border-button-color focus:ring-2 focus:ring-button-color/20 transition-none font-semibold leading-relaxed"
          >
            <option value="Public">Public (Fully Viewable)</option>
            <option value="Restricted">Restricted (Verification Required)</option>
            <option value="Private">Private (Internal Only)</option>
          </select>
          {errors.visibility && (
            <p className="text-xs text-destructive font-semibold mt-1">{errors.visibility.message}</p>
          )}
        </div>

      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
        >
          {isSubmitting ? 'Publishing...' : 'Publish Land Parcel'}
        </Button>
      </div>
    </form>
  )
}

export default PublishParcelStep