"use client"
import React from 'react'
import { Plus, Paperclip, RefreshCw, CheckCircle, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HistoryItem {
  action: string
  time: string
  admin: string
}

interface ParcelHistoryTabProps {
  history: HistoryItem[]
}

const ParcelHistoryTab = ({ history }: ParcelHistoryTabProps) => {
  // Preset timeline events from Screenshot 4
  const timelineEvents = [
    {
      action: 'Parcel Created',
      meta: 'by Admin Jean',
      time: '12 Jan 2025 09:14',
      icon: Plus,
      iconBg: 'bg-blue-50 text-blue-500 border-blue-100'
    },
    {
      action: 'Documents Uploaded',
      meta: 'by Agent Paul',
      time: '14 Jan 2025 11:30',
      icon: Paperclip,
      iconBg: 'bg-blue-50 text-blue-500 border-blue-100'
    },
    {
      action: 'Status → Under Verification',
      meta: 'by Supervisor Marie',
      time: '16 Jan 2025 14:00',
      icon: RefreshCw,
      iconBg: 'bg-blue-50 text-blue-500 border-blue-100 animate-spin-slow'
    },
    {
      action: 'Status → Validated',
      meta: 'by Supervisor Marie',
      time: '20 Jan 2025 10:00',
      icon: CheckCircle,
      iconBg: 'bg-emerald-50 text-emerald-500 border-emerald-100'
    },
    {
      action: 'Status → Published',
      meta: 'by Admin Jean',
      time: '22 Jan 2025 16:00',
      icon: Globe,
      iconBg: 'bg-blue-50 text-blue-500 border-blue-100'
    }
  ]

  return (
    <div className="relative pl-7 space-y-6 border-l-2 border-slate-100 ml-4 py-2 animate-in fade-in duration-200">
      {timelineEvents.map((item, idx) => {
        const IconComponent = item.icon
        return (
          <div key={idx} className="relative flex flex-col justify-center">
            {/* Timeline icon node */}
            <div
              className={cn(
                "absolute left-[-43px] w-8 h-8 rounded-full border flex items-center justify-center bg-white shadow-sm shrink-0 select-none",
                item.iconBg
              )}
            >
              <IconComponent className="w-4 h-4" />
            </div>

            {/* Event info text */}
            <div className="leading-tight pl-1.5">
              <h3 className="text-xs md:text-sm font-bold text-slate-800">
                {item.action}
              </h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-semibold mt-1">
                {item.meta} &middot; {item.time}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ParcelHistoryTab