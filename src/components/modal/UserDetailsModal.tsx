"use client"
import React, { useEffect } from 'react'
import { X, Mail, Phone, Calendar, Clock, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from '@/interfaces/user.interface'
import formatDate from '@/utils/formatDate'

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onOpenEdit?: () => void
}

const getInitials = (name?: string | null) => {
  if (!name) return 'US'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
  onOpenEdit,
}: UserDetailsModalProps) => {
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

  const initials = getInitials(user.name)
  const displayRoles = user.roles?.length ? user.roles.join(', ') : 'USER'
  const displayEmail = user.email || user.publicEmail || 'N/A'
  const displayPhone = user.phone || user.publicPhone || 'N/A'

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-112.5 md:w-120 h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100 z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white select-none">
          <h2 className="text-sm font-extrabold text-slate-900">User Profile Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
          {/* Top Profile Card */}
          <div className="flex items-center gap-4 select-none">
            {user.profilePicture?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profilePicture.url}
                alt={user.name || 'Profile'}
                className="w-14 h-14 rounded-full object-cover shrink-0 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-blue-100 text-button-color flex items-center justify-center text-base font-extrabold shrink-0 shadow-md uppercase tracking-wider">
                {initials}
              </div>
            )}
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900 leading-none">
                {user.name || 'N/A'}
              </h3>

              <div className="flex items-center gap-2 pt-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 text-white uppercase tracking-wider select-none">
                  {displayRoles}
                </span>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap select-none uppercase tracking-wider',
                    user.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                  )}
                >
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-white divide-y divide-slate-50 text-xs font-semibold text-slate-700 select-none">
            {/* Slug / User ID */}
            {user.slug && (
              <div className="flex items-center justify-between p-3.5">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>User Code</span>
                </span>
                <span className="text-slate-800 font-mono">{user.slug}</span>
              </div>
            )}

            {/* Email */}
            <div className="flex items-center justify-between p-3.5">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>Email</span>
              </span>
              <span className="text-slate-800 select-all">{displayEmail}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between p-3.5">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Phone</span>
              </span>
              <span className="text-slate-800 font-mono tracking-wide">{displayPhone}</span>
            </div>

            {/* Account Created */}
            <div className="flex items-center justify-between p-3.5">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Account Created</span>
              </span>
              <span className="text-slate-800">{formatDate(user.createdAt)}</span>
            </div>

            {/* Last Active */}
            <div className="flex items-center justify-between p-3.5">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Last Active</span>
              </span>
              <span className="text-slate-800">
                {user.lastOnlineAt ? formatDate(user.lastOnlineAt) : 'Never'}
              </span>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="space-y-2 select-none">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Verification Status
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              <span
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold border',
                  user.isEmailVerified
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                )}
              >
                Email: {user.isEmailVerified ? 'Verified' : 'Unverified'}
              </span>
              <span
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold border',
                  user.isPhoneVerified
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                )}
              >
                Phone: {user.isPhoneVerified ? 'Verified' : 'Unverified'}
              </span>
              <span
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold border',
                  user.isNationalIdVerified
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                )}
              >
                NID: {user.isNationalIdVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {onOpenEdit && (
          <div className="border-t border-slate-150 p-4 bg-slate-50/50 flex items-center justify-end gap-2.5 select-none shrink-0">
            <button
              type="button"
              onClick={onOpenEdit}
              className="py-2 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 font-bold text-xs rounded-lg cursor-pointer transition-colors text-center select-none"
            >
              Edit User
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDetailsModal