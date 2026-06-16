"use client"
import React from 'react'
import { Owner } from '@/pages/app/ParcelsPage'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ParcelOwnersTabProps {
  owners: Owner[]
  onAddOwner: () => void
}

const ParcelOwnersTab = ({ owners, onAddOwner }: ParcelOwnersTabProps) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-sm font-bold text-slate-800">Primary Owner</span>
        <Button
          onClick={onAddOwner}
          className='w-auto py-2'
        >
          + Add Owner
        </Button>
      </div>

      {/* Owners Cards stack */}
      <div className="space-y-3">
        {owners.map((owner, idx) => {
          const isPrimary = idx === 0
          const initials = owner.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()

          // Mock National ID and share percentages matching image
          const mockNI = isPrimary ? 'NI-12847291' : `NI-9981734${idx + 1}`
          const mockShare = isPrimary ? '70%' : `${30 / (owners.length - 1)}%`

          return (
            <div
              key={owner.email + '-' + idx}
              className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm gap-3"
            >
              {/* Avatar and Info */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Initials badge */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none",
                    isPrimary ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-sky-50 text-sky-600 border border-sky-100"
                  )}
                >
                  {initials}
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="text-xs md:text-sm font-bold text-slate-800 truncate">
                    {owner.name}
                  </span>
                  <span className="text-[10px] md:text-xs text-slate-400 font-semibold mt-0.5 truncate">
                    {mockNI} &middot; {owner.phone}
                  </span>
                </div>
              </div>

              {/* Share & Deletion */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs md:text-sm font-bold text-blue-500">
                  {mockShare}
                </span>
                <button
                  onClick={() => alert(`Remove owner ${owner.name}`)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50/50 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Remove owner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ParcelOwnersTab