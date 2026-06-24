"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema, type UserFormValues } from '@/validation/user.validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { UserRecord } from '../app/users/UsersPage'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserRecord
  onEdit: (data: UserFormValues) => void
}

const EditUserModal = ({ isOpen, onClose, user, onEdit }: EditUserModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'Admin',
      status: user?.status === 'Active'
    }
  })

  useEffect(() => {
    if (isOpen && user) {
      document.body.style.overflow = 'hidden'
      reset({
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status === 'Active'
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, user, reset])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/60 backdrop-blur-[1.5px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-[440px] shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-sm font-extrabold text-slate-900">
            Edit User
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onEdit)} className="p-6 space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="e.g. Jean Alima"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive font-semibold mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+237 6XX XXX XXX"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-xs text-destructive font-semibold mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@domain.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive font-semibold mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password (Optional for Edit) */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Password (leave blank to keep current)</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive font-semibold mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Role selection */}
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              {...register('role')}
              className="w-full px-3.5 py-2.5 border border-slate-200 bg-white rounded-lg text-xs md:text-sm text-title focus:outline-none focus:border-button-color focus:ring-2 focus:ring-button-color/20 transition-none font-semibold leading-relaxed cursor-pointer"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Surveyor">Surveyor</option>
              <option value="Field Agent">Field Agent</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Client">Client</option>
            </select>
            {errors.role && (
              <p className="text-xs text-destructive font-semibold mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Account Status Switch */}
          <div className="flex items-center justify-between py-2 select-none">
            <Label htmlFor="status" className="text-xs font-bold text-slate-700">Account Status: Active</Label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="status"
                type="checkbox"
                {...register('status')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700 text-xs font-bold shadow-sm rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm rounded-lg cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Create User'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default EditUserModal