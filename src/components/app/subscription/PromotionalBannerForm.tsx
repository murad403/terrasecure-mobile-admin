"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { promoBannerSchema, type PromoBannerFormValues } from '@/validation/subscription.validation'
import { Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PromoBanner } from './SubscriptionPage'

interface BannerFormProps {
  banner: PromoBanner;
  onUpdate: (data: PromoBanner) => void;
}

const PromotionalBannerForm = ({ banner, onUpdate }: BannerFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<PromoBannerFormValues>({
    resolver: zodResolver(promoBannerSchema) as any,
    defaultValues: {
      labelPill: banner.labelPill,
      subtitle: banner.subtitle,
      title: banner.title,
      isActive: banner.isActive,
    },
  })

  // Keep form in sync if external banner state changes
  useEffect(() => {
    if (!isDirty) {
      reset({
        labelPill: banner.labelPill,
        subtitle: banner.subtitle,
        title: banner.title,
        isActive: banner.isActive,
      })
    }
  }, [banner, reset, isDirty])

  const isActive = watch('isActive')

  const onSubmit = (data: PromoBannerFormValues) => {
    onUpdate({
      labelPill: data.labelPill,
      subtitle: data.subtitle,
      title: data.title,
      isActive: data.isActive,
    })
    reset(data) // Reset dirty state
  }

  const handleToggle = () => {
    const nextVal = !isActive
    const currentValues = {
      labelPill: watch('labelPill'),
      subtitle: watch('subtitle'),
      title: watch('title'),
      isActive: nextVal,
    }
    onUpdate(currentValues)
    reset(currentValues)
  }

  const handleCancel = () => {
    reset({
      labelPill: banner.labelPill,
      subtitle: banner.subtitle,
      title: banner.title,
      isActive: banner.isActive,
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
      {/* Banner Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-violet-50 rounded-lg text-violet-600">
            <Megaphone size={16} />
          </div>
          <span className="text-xs font-bold text-gray-800">Promotional Banner</span>
          <span
            className={`text-[9px] px-2 py-0.5 rounded font-semibold border ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : 'bg-gray-50 text-gray-500 border-gray-150'
            }`}
          >
            {isActive ? 'Visible' : 'Hidden'}
          </span>
        </div>

        {/* Switch Toggle */}
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isActive ? 'bg-[#1b4332]' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isActive ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1: Label Pill & Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="labelPill">Label pill</Label>
            <Input
              id="labelPill"
              placeholder="e.g. Limited Time"
              {...register('labelPill')}
            />
            {errors.labelPill && (
              <p className="text-[10px] text-red-500 font-medium">{errors.labelPill.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              placeholder="e.g. Explore parcels at no cost!"
              {...register('subtitle')}
            />
            {errors.subtitle && (
              <p className="text-[10px] text-red-500 font-medium">{errors.subtitle.message}</p>
            )}
          </div>
        </div>

        {/* Row 2: Title */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. Free Access During Launch Period"
            {...register('title')}
          />
          {errors.title && (
            <p className="text-[10px] text-red-500 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* Actions */}
        {isActive && (
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="submit"
              className="w-auto py-2"
            >
              Save
            </Button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-3 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default PromotionalBannerForm