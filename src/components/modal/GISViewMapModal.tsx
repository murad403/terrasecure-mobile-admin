"use client"
import React, { useEffect } from 'react'
import { X, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RegistrationItem, RegistrationSurvey } from '@/redux/features/registrations/registration.type'

interface GISViewMapModalProps {
  isOpen: boolean
  onClose: () => void
  registration?: RegistrationItem
  survey?: RegistrationSurvey
  latitude?: number
  longitude?: number
  parcelName?: string
  area?: number
  registrationId?: string | number
  onConfirm?: () => void
}

const GISViewMapModal: React.FC<GISViewMapModalProps> = ({
  isOpen,
  onClose,
  registration,
  survey,
  latitude,
  longitude,
  parcelName,
  area,
  registrationId,
  onConfirm,
}) => {
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

  const points = survey?.points || []
  const pointsCount = points.length || (latitude && longitude ? 1 : 0)
  const computedArea = survey?.computedAreaSqm || registration?.areaSqm || area || 0
  const registrationIdStr = registrationId || registration?.slug || (registration?.id ? `REG-${registration.id}` : '') || parcelName || 'GIS Submission'
  const firstPoint = points[0] || {
    lat: latitude || registration?.location?.latitude || 40.7128,
    lng: longitude || registration?.location?.longitude || -74.006,
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              GIS View – {registrationIdStr}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 font-sans">
              QField Data · {pointsCount} GPS points collected
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Visualization Area */}
        <div className="relative flex-1 bg-[#eaf4ec] min-h-80 flex items-center justify-center overflow-hidden select-none p-4">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Topographic background contour lines */}
            <path d="M -50,50 C 100,20 200,80 300,10 C 400,-60 500,40 650,20" fill="none" stroke="#d5e8dc" strokeWidth="1.5" />
            <path d="M -50,110 C 110,80 210,140 310,70 C 410,0 510,100 650,80" fill="none" stroke="#d5e8dc" strokeWidth="1.5" />
            <path d="M -50,170 C 120,140 220,200 320,130 C 420,60 520,160 650,140" fill="none" stroke="#d5e8dc" strokeWidth="1.5" />
            <path d="M -50,230 C 130,200 230,260 330,190 C 430,120 530,220 650,200" fill="none" stroke="#d5e8dc" strokeWidth="1.5" />

            {/* Polygon Boundary */}
            <polygon
              points="200,120 380,150 400,280 330,340 210,320 180,210"
              fill="#2e7d32"
              fillOpacity="0.18"
              stroke="#2e7d32"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />

            {/* Vertices */}
            <circle cx="200" cy="120" r="5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
            <circle cx="380" cy="150" r="5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
            <circle cx="400" cy="280" r="5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
            <circle cx="330" cy="340" r="5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
            <circle cx="210" cy="320" r="5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
            <circle cx="180" cy="210" r="5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
          </svg>

          {/* Floating Info Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-[2.5px] border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-md text-slate-800 pointer-events-none select-none">
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>
                {registration?.location?.city || registration?.location?.addressLine1 || parcelName || 'Parcel Location'}
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-500 font-mono block mt-0.5 ml-5">
              Lat: {firstPoint.lat}°, Lng: {firstPoint.lng}°
            </span>
          </div>

          <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-[2.5px] border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-md text-right text-slate-800 pointer-events-none select-none">
            <div className="text-[10.5px] font-extrabold text-slate-800">
              Area: {Number(computedArea).toLocaleString()} m²
            </div>
            <div className="text-[9px] font-bold text-slate-500 mt-0.5">
              {pointsCount} GPS points collected
            </div>
          </div>
        </div>

        {/* GPS Points Table Details */}
        {points.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 max-h-36 overflow-y-auto">
            <h4 className="text-[11px] font-bold text-slate-700 mb-2">Captured GPS Points</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {points.map((pt, idx) => (
                <div key={idx} className="p-1.5 bg-white rounded border border-slate-200 text-[10px] font-mono">
                  <span className="font-bold text-slate-800">Pt #{idx + 1}:</span> {pt.lat.toFixed(4)}, {pt.lng.toFixed(4)}
                  {pt.accuracy && <span className="text-slate-400 block text-[9px]">±{pt.accuracy}m</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between font-semibold">
          <div className="text-[10px] text-slate-500">
            Source: {survey?.source || 'MOBILE_GPS'} · Status: {survey?.status || 'VALIDATED'}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-auto px-4">
              Close
            </Button>
            {onConfirm && (
              <Button type="button" onClick={onConfirm} className="w-auto px-5 bg-emerald-600 hover:bg-emerald-700 text-white">
                Confirm & Import GIS Data
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GISViewMapModal