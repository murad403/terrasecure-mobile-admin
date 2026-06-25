"use client"
import React, { useEffect } from 'react'
import { X, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GISViewMapModalProps {
  isOpen: boolean
  onClose: () => void
  latitude: number
  longitude: number
  parcelName: string
  area: number
  registrationId: string
  onConfirm: () => void
}

const GISViewMapModal = ({
  isOpen,
  onClose,
  latitude,
  longitude,
  parcelName,
  area,
  registrationId,
  onConfirm
}: GISViewMapModalProps) => {

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

  return (
    <div
      className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-205 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              GIS View – {registrationId}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 font-sans">
              QField data - 24 GPS points collected
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Body (High-fidelity custom SVG topographic map) */}
        <div className="relative flex-1 bg-[#eaf4ec] min-h-[400px] flex items-center justify-center overflow-hidden select-none">
          
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Topographic contours */}
            <path d="M -50,50 C 100,20 200,80 300,10 C 400,-60 500,40 650,20" fill="none" stroke="#d5e8dc" strokeWidth="1.5" />
            <path d="M -50,110 C 110,80 210,140 310,70 C 410,0 510,100 650,80" fill="none" stroke="#d5e8dc" strokeWidth="1.5" />
            <path d="M -50,170 C 120,140 220,200 320,130 C 420,60 520,160 650,140" fill="none" stroke="#d5e8dc" strokeWidth="1.5" />
            <path d="M -50,230 C 130,200 230,260 330,190 C 430,120 530,220 650,200" fill="none" stroke="#d5e8dc" strokeWidth="1.5" />
            <path d="M -50,290 C 140,260 240,320 340,250 C 440,180 540,280 650,260" fill="none" stroke="#d5e8dc" strokeWidth="1.5" />
            <path d="M -50,350 C 150,320 250,380 350,310 C 450,240 550,340 650,320" fill="none" stroke="#d5e8dc" strokeWidth="1.5" />
            
            {/* Shaded forest zones */}
            <path d="M 0,0 C 100,50 150,10 250,80 L 250,0 Z" fill="#d2ebd9" fillOpacity="0.4" />
            <path d="M 400,0 C 480,60 520,30 650,100 L 650,0 Z" fill="#d2ebd9" fillOpacity="0.4" />
            <path d="M 0,320 C 120,380 200,340 320,400 L 0,400 Z" fill="#d2ebd9" fillOpacity="0.4" />

            {/* A winding blue river */}
            <path d="M 380,-20 Q 360,120 400,210 T 350,420" fill="none" stroke="#badcfc" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M 380,-20 Q 360,120 400,210 T 350,420" fill="none" stroke="#cbe3fc" strokeWidth="2" strokeLinecap="round" />
            
            {/* Minor streams */}
            <path d="M 400,210 Q 480,240 550,230" fill="none" stroke="#badcfc" strokeWidth="2.5" strokeLinecap="round" />

            {/* Roads */}
            <path d="M -20,280 Q 200,290 310,310 T 670,410" fill="none" stroke="#d8dbe2" strokeWidth="5" strokeLinecap="round" />
            <path d="M -20,280 Q 200,290 310,310 T 670,410" fill="none" stroke="#fcfdfd" strokeWidth="2.5" strokeLinecap="round" />

            <path d="M 310,310 Q 280,180 300,50" fill="none" stroke="#d8dbe2" strokeWidth="5" strokeLinecap="round" />
            <path d="M 310,310 Q 280,180 300,50" fill="none" stroke="#fcfdfd" strokeWidth="2.5" strokeLinecap="round" />

            {/* Road Shield N15 */}
            <rect x="500" y="375" width="22" height="13" rx="3" fill="#d32f2f" />
            <text x="511" y="385" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">N15</text>

            <rect x="272" y="115" width="22" height="13" rx="3" fill="#d32f2f" />
            <text x="283" y="125" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">N15</text>

            {/* Map Labels */}
            <text x="440" y="330" fill="#2d6a4f" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">Restaurant</text>
            <text x="440" y="340" fill="#2d6a4f" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">Ecologique de Yoko</text>
            
            <circle cx="432" cy="334" r="2.5" fill="#2d6a4f" />

            <text x="520" y="270" fill="#52b788" fontSize="10" fontWeight="extrabold" letterSpacing="1" fontFamily="sans-serif" opacity="0.6">Yoko</text>
            <text x="120" y="180" fill="#52b788" fontSize="9" fontWeight="extrabold" letterSpacing="0.5" fontFamily="sans-serif" opacity="0.6">Lewou</text>

            {/* Green Shaded Boundary Polygon */}
            <polygon
              points="230,140 375,170 395,290 340,360 215,335 195,225"
              fill="#2e7d32"
              fillOpacity="0.18"
              stroke="#2e7d32"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />

            {/* Vertices */}
            <circle cx="230" cy="140" r="4.5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
            <circle cx="375" cy="170" r="4.5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
            <circle cx="395" cy="290" r="4.5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
            <circle cx="340" cy="360" r="4.5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
            <circle cx="215" cy="335" r="4.5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
            <circle cx="195" cy="225" r="4.5" fill="#1b5e20" stroke="white" strokeWidth="1.5" />
          </svg>

          {/* Floating Badges */}
          {/* Top-Left: Location Info */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-[2.5px] border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-md text-slate-800 pointer-events-none select-none">
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" fill="currentColor" />
              <span>Yaoundé, Bastos</span>
            </div>
            <span className="text-[9px] font-bold text-slate-500 font-mono block mt-0.5 ml-5">
              3.848°N 11.502°E
            </span>
          </div>

          {/* Bottom-Right: Claimed Area Info */}
          <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-[2.5px] border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-md text-right text-slate-800 pointer-events-none select-none">
            <div className="text-[10.5px] font-extrabold text-slate-800">
              Area: {area.toLocaleString()} m²
            </div>
            <div className="text-[9px] font-bold text-slate-500 mt-0.5">
              24 GPS points
            </div>
          </div>

          {/* Top-Right Stacked Zoom Buttons */}
          <div className="absolute top-4 right-4 z-10 flex flex-col bg-white border border-slate-200 rounded-lg shadow-md divide-y divide-slate-150 overflow-hidden select-none">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-bold text-sm transition-colors cursor-pointer"
            >
              +
            </button>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-bold text-sm transition-colors cursor-pointer"
            >
              -
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between font-semibold">
          <div className="flex items-center gap-4 text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>Surveyor: Paul Biya Jr</span>
            </div>
            <span>Collected: 3 Jun 2025 14:30</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={onConfirm}
              className='w-auto'
            >
              Confirm GIS Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GISViewMapModal