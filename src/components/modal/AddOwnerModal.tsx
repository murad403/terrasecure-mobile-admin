"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ownerSchema, type OwnerFormValues } from '@/validation/parcel.validation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddOwnerModalProps {
  isOpen: boolean
  onClose: () => void
  onAddOwner: (data: OwnerFormValues) => void
}

const AddOwnerModal = ({ isOpen, onClose, onAddOwner }: AddOwnerModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      role: 'Co-Owner'
    }
  })

  // Lock scroll
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

  const onSubmit = (data: OwnerFormValues) => {
    onAddOwner(data)
    reset()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="bg-white rounded-2xl border border-slate-100 w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-title">Add Owner</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
          <div className="p-6 space-y-4">
            
            {/* Owner Name */}
            <div className="space-y-1.5">
              <Label htmlFor="owner_name">Owner Name</Label>
              <Input
                id="owner_name"
                placeholder="e.g. Jean Alima"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-destructive font-medium mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g. +237 677 889 900"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-xs text-destructive font-medium mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. owner@landsecure.cm"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive font-medium mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Role select */}
            <div className="space-y-1.5">
              <Label htmlFor="role">Owner Role</Label>
              <select
                id="role"
                {...register('role')}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title focus:outline-none focus:border-button-color transition-colors"
              >
                <option value="Primary Owner">Primary Owner</option>
                <option value="Co-Owner">Co-Owner</option>
                <option value="Stakeholder">Stakeholder</option>
              </select>
              {errors.role && (
                <p className="text-xs text-destructive font-medium mt-1">{errors.role.message}</p>
              )}
            </div>

          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 rounded-lg w-auto px-5"
            >
              {isSubmitting ? 'Adding...' : 'Add Owner'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddOwnerModal