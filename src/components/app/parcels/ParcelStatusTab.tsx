"use client"
import React, { useState } from 'react'
import { Parcel } from '@/components/app/parcels/ParcelsPage'
import { Label } from '@/components/ui/label'

interface ParcelStatusTabProps {
  parcel: Parcel
  onUpdateStatus: (newStatus: string, reason: string) => void
}

const ParcelStatusTab = ({ parcel, onUpdateStatus }: ParcelStatusTabProps) => {
  const [status, setStatus] = useState(parcel.status)
  const [locked, setLocked] = useState(true)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    onUpdateStatus(newStatus, 'Status changed via dropdown picker in details Status tab')
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Change Status Dropdown */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Change Status
        </span>
        <select
          id="status-picker"
          disabled={locked}
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:border-button-color cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="Published">Published</option>
          <option value="Pending">Pending</option>
          <option value="Disputed">Disputed</option>
          <option value="Reserved">Reserved</option>
          <option value="Validated">Validated</option>
          <option value="Under Verification">Under Verification</option>
          <option value="Sold">Sold</option>
          <option value="Draft">Draft</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      {/* Lock status changes switch */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 mt-2">
        <span className="text-sm font-semibold text-slate-700">Lock status changes</span>

        {/* Customized CSS Switch Toggle */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={locked}
            onChange={(e) => setLocked(e.target.checked)}
          />
          <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
        </label>
      </div>
    </div>
  )
}

export default ParcelStatusTab