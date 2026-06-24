"use client"
import React, { useEffect } from 'react'
import { X, Mail, Phone, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type UserRecord } from '../app/users/UsersPage'

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserRecord
  onOpenEdit: () => void
  onToggleStatus: () => void
  onDelete: () => void
}

const getInitials = (name: string) => {
  if (name === 'Paul Biya Jr') return 'PIJ'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getAvatarBg = (role: string) => {
  switch (role) {
    case 'Super Admin':
      return 'bg-[#263238] text-[#90a4ae]'
    case 'Admin':
      return 'bg-blue-50 text-blue-600'
    case 'Surveyor':
      return 'bg-[#e8eaf6] text-[#3f51b5]'
    case 'Field Agent':
      return 'bg-amber-50 text-amber-600'
    case 'Supervisor':
      return 'bg-teal-50 text-teal-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
  onOpenEdit,
  onToggleStatus,
  onDelete
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

  const initials = getInitials(user.fullName)
  const avatarBg = getAvatarBg(user.role)

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-[450px] md:w-[480px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100 z-50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white select-none">
          <h2 className="text-sm font-extrabold text-slate-900">
            User Profile
          </h2>
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
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center text-base font-extrabold shrink-0 shadow-md uppercase tracking-wider",
              avatarBg
            )}>
              {initials}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900 leading-none">{user.fullName}</h3>
              
              <div className="flex items-center gap-2 pt-1.5">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 text-white uppercase tracking-wider select-none">
                  {user.role}
                </span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap select-none uppercase tracking-wider",
                  user.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-rose-50 text-rose-600 border-rose-100'
                )}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-white divide-y divide-slate-50 text-xs font-semibold text-slate-700 select-none">
            
            {/* Email */}
            <div className="flex items-center justify-between p-3.5">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>Email</span>
              </span>
              <span className="text-slate-800 select-all">{user.email}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between p-3.5">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Phone</span>
              </span>
              <span className="text-slate-800 font-mono tracking-wide">{user.phone}</span>
            </div>

            {/* Account Created */}
            <div className="flex items-center justify-between p-3.5">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Account Created</span>
              </span>
              <span className="text-slate-800">{user.createdDate}</span>
            </div>

            {/* Last Login */}
            <div className="flex items-center justify-between p-3.5">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Last Login</span>
              </span>
              <span className="text-slate-800">2 days ago</span>
            </div>

          </div>

          {/* Metrics Blocks */}
          <div className="grid grid-cols-2 gap-3 select-none">
            {/* Requests Box */}
            <div className="bg-blue-50/20 border border-blue-100/50 p-4 rounded-xl text-center">
              <span className="text-blue-600 font-extrabold text-xl block">
                {user.requestsSubmitted}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1 block leading-tight">
                Requests Submitted
              </span>
            </div>

            {/* Parcels Box */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
              <span className="text-slate-800 font-extrabold text-xl block">
                {user.parcelsRegistered}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1 block leading-tight">
                Parcels Registered
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-3 select-none">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Recent Activity
            </h4>
            
            <div className="space-y-3 pt-1">
              {user.recentActivity.length > 0 ? (
                user.recentActivity.map((act) => (
                  <div key={act.id} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
                    <div>
                      <span className="font-semibold text-slate-700">{act.text}</span>{' '}
                      <span className="text-[10px] font-bold text-slate-400 font-mono whitespace-nowrap">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] font-bold text-slate-400 italic">No recent activity recorded.</p>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-150 p-4 bg-slate-50/50 flex items-center justify-between gap-2.5 select-none shrink-0">
          
          {/* Edit Button */}
          <button
            type="button"
            onClick={onOpenEdit}
            className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 font-bold text-xs rounded-lg cursor-pointer transition-colors text-center select-none"
          >
            Edit User
          </button>

          {/* Suspend Toggle Button */}
          <button
            type="button"
            onClick={onToggleStatus}
            className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 font-bold text-xs rounded-lg cursor-pointer transition-colors text-center select-none"
          >
            {user.status === 'Active' ? 'Suspend' : 'Activate'}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to delete user ${user.fullName}?`)) {
                onDelete()
              }
            }}
            className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 font-bold text-xs rounded-lg cursor-pointer transition-colors text-center select-none"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  )
}

export default UserDetailsModal