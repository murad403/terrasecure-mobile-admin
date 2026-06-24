"use client"
import React from 'react'
import { MapPin, Layers, ClipboardList, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SurveyorRecord {
  id: string
  fullName: string
  status: 'busy' | 'available' | 'offline'
  initials: string
  region: string
  target: string
  activeCount: number
  doneCount: number
  rating: number
}

interface SurveyorCardProps {
  surveyor: SurveyorRecord
}

const SurveyorCard = ({ surveyor }: SurveyorCardProps) => {
  const avatarCls = cn(
    "w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 tracking-wider uppercase",
    surveyor.status === 'busy'    && "bg-amber-100 text-amber-700",
    surveyor.status === 'available' && "bg-emerald-100 text-emerald-700",
    surveyor.status === 'offline'   && "bg-slate-100 text-slate-500"
  )

  const badgeCls = cn(
    "inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 uppercase",
    surveyor.status === 'busy'      && 'bg-amber-50 text-amber-600 border border-amber-200',
    surveyor.status === 'available' && 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    surveyor.status === 'offline'   && 'bg-slate-100 text-slate-500 border border-slate-200'
  )

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3 hover:shadow-md transition-shadow select-none">
      {/* Top row */}
      <div className="flex items-center gap-3">
        <div className={avatarCls}>{surveyor.initials}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-extrabold text-slate-900 truncate leading-tight">
            {surveyor.fullName}
          </h4>
          <span className={badgeCls}>{surveyor.status}</span>
        </div>
      </div>

      {/* Details list */}
      <div className="space-y-1.5 pt-2 border-t border-slate-50 text-[11px] text-slate-500 font-semibold">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
          <span>{surveyor.region}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-rose-500 shrink-0" />
          <span>{surveyor.target}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ClipboardList className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{surveyor.activeCount} active / {surveyor.doneCount} done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
          <span>{surveyor.rating.toFixed(1)}/5.0</span>
        </div>
      </div>
    </div>
  )
}

export default SurveyorCard