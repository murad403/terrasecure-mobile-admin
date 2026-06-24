"use client"
import React, { useState, useEffect } from 'react'
import { X, MapPin } from 'lucide-react'
import { type ConsultationRecord } from './ConsultationsPage'

interface ConsultationsDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  consultation: ConsultationRecord
  onApprove: (responseText: string) => void
  onReject: (responseText: string) => void
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const ConsultationsDetailsModal = ({
  isOpen,
  onClose,
  consultation,
  onApprove,
  onReject
}: ConsultationsDetailsModalProps) => {
  const [responseText, setResponseText] = useState(consultation.adminResponse || '')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setResponseText(consultation.adminResponse || '')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, consultation])

  if (!isOpen) return null

  const initials = getInitials(consultation.requesterName)

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-[450px] md:w-[480px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100 z-50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white select-none">
          <h2 className="text-sm font-extrabold text-slate-900">
            Consultation {consultation.id}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 select-none text-xs">
          
          {/* Requester Info Box */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              Requester Info
            </span>
            <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 rounded-xl p-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 font-extrabold text-sm shrink-0 shadow-sm uppercase tracking-wide">
                {initials}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900">{consultation.requesterName}</h3>
                <span className="text-[10px] font-semibold text-slate-400">
                  Submitted {consultation.date}
                </span>
              </div>
            </div>
          </div>

          {/* Requester Location Green Box */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-700 block">Requester location</span>
              <span className="text-slate-700 font-semibold font-mono tracking-wide">{consultation.gpsCoordinates}</span>
            </div>
          </div>

          {/* Related Parcel Box */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              Related Parcel
            </span>
            <div className="bg-white border border-slate-100 rounded-xl p-4">
              <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                {consultation.parcelId}
              </span>
            </div>
          </div>

          {/* Request Message Box */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              Request Message
            </span>
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 text-slate-700 font-semibold leading-relaxed">
              {consultation.message}
            </div>
          </div>

          {/* Admin Response Box */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              Admin Response
            </span>
            <textarea
              placeholder="Write your response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full border border-slate-200 bg-white rounded-xl p-4 text-xs md:text-sm text-title placeholder:text-slate-400 focus:outline-none focus:border-button-color focus:ring-2 focus:ring-button-color/20 transition-all font-semibold min-h-[110px] leading-relaxed resize-none"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between gap-3 shrink-0 select-none">
          {/* Approve Button */}
          <button
            type="button"
            onClick={() => onApprove(responseText)}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors text-center select-none shadow-sm"
          >
            Approve
          </button>

          {/* Reject Button */}
          <button
            type="button"
            onClick={() => onReject(responseText)}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors text-center select-none shadow-sm"
          >
            Reject
          </button>
        </div>

      </div>
    </div>
  )
}

export default ConsultationsDetailsModal