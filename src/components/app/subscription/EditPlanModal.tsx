"use client"
import React, { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planSchema, type PlanFormValues } from '@/validation/subscription.validation'
import { X, Zap, Star, Crown, Rocket, Gem, Trophy, Sun, Flame, Plus, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubscriptionPlan } from './SubscriptionPage'

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onSave: (data: SubscriptionPlan) => void;
}

const EditPlanModal = ({ isOpen, onClose, plan, onSave }: EditPlanModalProps) => {
  const iconList = [
    { name: 'lightning', icon: <Zap size={16} /> },
    { name: 'star', icon: <Star size={16} /> },
    { name: 'crown', icon: <Crown size={16} /> },
    { name: 'rocket', icon: <Rocket size={16} /> },
    { name: 'diamond', icon: <Gem size={16} /> },
    { name: 'trophy', icon: <Trophy size={16} /> },
    { name: 'sun', icon: <Sun size={16} /> },
    { name: 'fire', icon: <Flame size={16} /> },
  ]

  const colorList = [
    { name: 'orange', class: 'bg-amber-500' },
    { name: 'green', class: 'bg-emerald-600' },
    { name: 'purple', class: 'bg-purple-600' },
    { name: 'red', class: 'bg-red-600' },
    { name: 'blue', class: 'bg-blue-600' },
  ]

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema) as any,
    defaultValues: {
      icon: plan.icon,
      name: plan.name,
      unlocksDescription: plan.unlocksDescription,
      price: plan.price,
      currency: plan.currency,
      period: plan.period,
      badgeLabel: plan.badgeLabel,
      badgeColor: plan.badgeColor || 'orange',
      features: plan.features,
      displayOrder: plan.displayOrder,
      isActive: plan.isActive,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  })

  // Watch fields for interactive styling
  const selectedIcon = watch('icon')
  const selectedColor = watch('badgeColor')
  const isActive = watch('isActive')

  // Keep form in sync if plan changes
  useEffect(() => {
    reset({
      icon: plan.icon,
      name: plan.name,
      unlocksDescription: plan.unlocksDescription,
      price: plan.price,
      currency: plan.currency,
      period: plan.period,
      badgeLabel: plan.badgeLabel,
      badgeColor: plan.badgeColor || 'orange',
      features: plan.features,
      displayOrder: plan.displayOrder,
      isActive: plan.isActive,
    })
  }, [plan, reset])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const onSubmit = (data: PlanFormValues) => {
    onSave({
      ...data,
      id: plan.id, // Preserve plan ID
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="bg-white rounded-2xl border border-slate-100 w-full max-w-lg shadow-2xl flex flex-col my-8 animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-tight">Edit Plan</h2>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-none">Editing &quot;{plan.name}&quot;</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* Plan Icon Select */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Plan Icon</Label>
              <div className="flex flex-wrap gap-2">
                {iconList.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setValue('icon', item.name)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      selectedIcon === item.name
                        ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
              {errors.icon && (
                <p className="text-[10px] text-red-500 font-medium">{errors.icon.message}</p>
              )}
            </div>

            {/* Plan Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-gray-500">Plan Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Weekly, Monthly..."
                className="text-xs py-1.5 focus:border-[#1b4332]"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[10px] text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Unlocks Description */}
            <div className="space-y-1.5">
              <Label htmlFor="unlocksDescription" className="text-xs text-gray-500">Unlocks Description</Label>
              <Input
                id="unlocksDescription"
                placeholder="e.g. 20 unlocks per week"
                className="text-xs py-1.5 focus:border-[#1b4332]"
                {...register('unlocksDescription')}
              />
              {errors.unlocksDescription && (
                <p className="text-[10px] text-red-500 font-medium">{errors.unlocksDescription.message}</p>
              )}
            </div>

            {/* Pricing Details Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs text-gray-500">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g. 2500"
                  className="text-xs py-1.5 focus:border-[#1b4332]"
                  {...register('price')}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="currency" className="text-xs text-gray-500">Currency</Label>
                <select
                  id="currency"
                  {...register('currency')}
                  className="w-full h-[34px] px-2.5 border border-slate-200 bg-white rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1b4332] transition-colors"
                >
                  <option value="XAF">XAF</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="period" className="text-xs text-gray-500">Period</Label>
                <select
                  id="period"
                  {...register('period')}
                  className="w-full h-[34px] px-2.5 border border-slate-200 bg-white rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1b4332] transition-colors"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
            {(errors.price || errors.currency || errors.period) && (
              <p className="text-[10px] text-red-500 font-medium">
                {errors.price?.message || errors.currency?.message || errors.period?.message}
              </p>
            )}

            {/* Badge Info Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="badgeLabel" className="text-xs text-gray-500">Badge Label (optional)</Label>
                <Input
                  id="badgeLabel"
                  placeholder="e.g. MOST POPULAR"
                  className="text-xs py-1.5 focus:border-[#1b4332]"
                  {...register('badgeLabel')}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Badge Color</Label>
                <div className="flex items-center space-x-2 h-[34px]">
                  {colorList.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setValue('badgeColor', item.name)}
                      className={`w-6 h-6 rounded-full transition-all cursor-pointer ${item.class} ${
                        selectedColor === item.name
                          ? 'ring-2 ring-offset-2 ring-slate-800'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={item.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Plan Features with add/remove */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-gray-500">Plan Features</Label>
                <button
                  type="button"
                  onClick={() => append({ text: '', enabled: true })}
                  className="text-emerald-700 hover:text-emerald-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} strokeWidth={3} />
                  Add feature
                </button>
              </div>

              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-150">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                      {...register(`features.${index}.enabled` as const)}
                    />
                    <Input
                      placeholder="Feature description..."
                      className="text-xs py-1 flex-1 focus:border-[#1b4332]"
                      {...register(`features.${index}.text` as const)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 shrink-0 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {errors.features && (
                <p className="text-[10px] text-red-500 font-medium">{errors.features.message}</p>
              )}
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="displayOrder" className="text-xs text-gray-500">Display Order</Label>
                <span className="text-[10px] text-gray-400">Lower number = shown first</span>
              </div>
              <Input
                id="displayOrder"
                type="number"
                className="text-xs py-1.5 focus:border-[#1b4332]"
                {...register('displayOrder')}
              />
              {errors.displayOrder && (
                <p className="text-[10px] text-red-500 font-medium">{errors.displayOrder.message}</p>
              )}
            </div>

            {/* Plan Active Switch */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-xs text-gray-700 font-bold block leading-normal">Plan Active</Label>
                <span className="text-[10px] text-gray-400 font-light block leading-none">
                  Visible to clients on the subscription page
                </span>
              </div>
              <button
                type="button"
                onClick={() => setValue('isActive', !isActive)}
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
          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-gray-150 bg-white cursor-pointer"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1b4332] hover:bg-[#143426] text-white font-semibold text-xs py-2 rounded-lg w-auto px-5 cursor-pointer flex items-center gap-1.5"
            >
              <Save size={14} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPlanModal