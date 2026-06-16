"use client"
import React, { useEffect, useRef } from 'react'
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationsDropdownProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const NotificationsDropdown = ({ isOpen, onClose, className }: NotificationsDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const notifications = [
    {
      id: 1,
      title: 'Conflict detected on Parcel #CM-2847',
      time: '2 min ago',
      type: 'conflict',
      icon: AlertCircle,
      iconBg: 'bg-red-50 text-red-500',
      unread: true
    },
    {
      id: 2,
      title: 'Registration #REG-1203 needs review',
      time: '15 min ago',
      type: 'review',
      icon: FileText,
      iconBg: 'bg-amber-50 text-amber-500',
      unread: true
    },
    {
      id: 3,
      title: 'QField submission approved by Supervisor',
      time: '1h ago',
      type: 'approved',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-500',
      unread: true
    }
  ]

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-50">
        <span className="font-semibold text-title text-sm">Notifications</span>
        <button
          onClick={() => alert('Mark all read')}
          className="text-xs text-button-color hover:underline font-medium"
        >
          Mark all read
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50">
        {notifications.map((item) => {
          const IconComponent = item.icon
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-4 hover:bg-slate-50/50 cursor-pointer transition-colors relative"
            >
              {/* Icon Container */}
              <div className={cn("flex items-center justify-center w-8 h-8 rounded-full shrink-0", item.iconBg)}>
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-xs font-semibold text-title leading-snug line-clamp-2">
                  {item.title}
                </p>
                <span className="text-[10px] text-subtitle mt-1 block">
                  {item.time}
                </span>
              </div>

              {/* Unread dot indicator */}
              {item.unread && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-50 text-center">
        <button
          onClick={() => {
            onClose()
            alert('Navigate to Notifications Page')
          }}
          className="text-xs text-button-color hover:underline font-medium block w-full py-1"
        >
          View all notifications
        </button>
      </div>
    </div>
  )
}

export default NotificationsDropdown