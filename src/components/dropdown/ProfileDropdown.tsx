"use client"
import React, { useEffect, useRef } from 'react'
import { User, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { removeToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ProfileDropdownProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const ProfileDropdown = ({ isOpen, onClose, className }: ProfileDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleLogout = async () => {
    onClose()
    await removeToken()
    toast.success('Signed out successfully')
    router.push('/auth/sign-in')
    router.refresh()
  }

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
    >
      {/* Profile Link */}
      <button
        onClick={() => {
          onClose()
          router.push('/settings')
        }}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium text-left cursor-pointer"
      >
        <User className="w-4 h-4 text-subtitle" />
        <span>Profile</span>
      </button>

      {/* Settings Link */}
      <button
        onClick={() => {
          onClose()
          router.push('/settings')
        }}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium text-left cursor-pointer"
      >
        <Settings className="w-4 h-4 text-subtitle" />
        <span>Settings</span>
      </button>

      {/* Divider */}
      <div className="h-px bg-slate-100 my-1.5" />

      {/* Sign Out Link */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors font-medium text-left cursor-pointer"
      >
        <LogOut className="w-4 h-4 text-red-500" />
        <span>Sign out</span>
      </button>
    </div>
  )
}

export default ProfileDropdown