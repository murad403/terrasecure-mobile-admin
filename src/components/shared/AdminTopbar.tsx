"use client"
import React, { useState } from 'react'
import { Bell, Search, Menu, ChevronDown } from 'lucide-react'
import ProfileDropdown from '../dropdown/ProfileDropdown'
import NotificationsDropdown from '../dropdown/NotificationsDropdown'

interface AdminTopbarProps {
  setMobileOpen: (open: boolean) => void
}

const AdminTopbar = ({ setMobileOpen }: AdminTopbarProps) => {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="h-16 border-b border-slate-100 bg-white sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-slate-500 hover:text-title p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search input bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-subtitle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search parcels, users, cases..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/40 rounded-lg text-sm text-title placeholder:text-subtitle focus:border-button-color focus:bg-white focus:outline-none focus:ring-2 focus:ring-button-color/20 transition-all"
          />
        </div>
      </div>

      {/* Right side: Actions & User Info */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              setProfileOpen(false)
            }}
            className="text-slate-500 hover:text-title p-2 rounded-full hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white border border-white">
              7
            </span>
          </button>

          {/* Notifications Dropdown */}
          <NotificationsDropdown
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        {/* User Info & Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen)
              setNotificationsOpen(false)
            }}
            className="flex items-center gap-2.5 hover:bg-slate-50 p-1 md:p-1.5 rounded-lg transition-colors cursor-pointer text-left"
          >
            {/* Avatar Circle */}
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-button-color text-white font-bold text-xs select-none">
              JA
            </div>

            {/* Profile Info */}
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-semibold text-title text-xs">Jean Alima</span>
              <span className="text-[9px] text-subtitle">Super Admin</span>
            </div>

            <ChevronDown className="w-4 h-4 text-subtitle hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          <ProfileDropdown
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
          />
        </div>
      </div>
    </header>
  )
}

export default AdminTopbar