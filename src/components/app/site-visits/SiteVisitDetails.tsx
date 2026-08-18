"use client"
import React from 'react'
import { X, Loader2 } from 'lucide-react'

interface SiteVisitDetailsProps {
  isOpen: boolean
  onClose: () => void
  visit: any
  isLoading: boolean
}

const SiteVisitDetails = ({ isOpen, onClose, visit, isLoading }: SiteVisitDetailsProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-55 flex justify-end bg-slate-950/60 backdrop-blur-[1.5px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border-l border-slate-200 w-full max-w-md h-full shadow-2xl overflow-y-auto p-6 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-lg font-extrabold text-slate-900">
            {visit?.slug || 'Site Visit Details'}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-sm font-semibold text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-button-color" />
            <span>Loading visit details...</span>
          </div>
        ) : visit ? (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Surveyor</p>
              <p className="font-semibold text-slate-800">{visit.surveyor?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Visit Type</p>
              <p className="font-semibold text-slate-800">
                {visit.kind ? visit.kind.replaceAll('_', ' ') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Scheduled At</p>
              <p className="font-semibold text-slate-800">{visit.scheduledAt}</p>
            </div>
            {visit.parcel && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Parcel</p>
                <p className="font-semibold text-slate-800">{visit.parcel.slug}</p>
              </div>
            )}
            {visit.registration && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Registration</p>
                <p className="font-semibold text-slate-800">{visit.registration.slug}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-400">No details found.</p>
        )}
      </div>
    </div>
  )
}

export default SiteVisitDetails