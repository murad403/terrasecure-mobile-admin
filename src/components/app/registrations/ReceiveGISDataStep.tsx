"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import GISViewMapModal from '@/components/modal/GISViewMapModal'

interface ReceiveGISDataStepProps {
  registration: any
  onUpdate: (data: any) => void
  onCompleteStep: () => void
}

const ReceiveGISDataStep = ({ registration, onUpdate, onCompleteStep }: ReceiveGISDataStepProps) => {
  const [mapOpen, setMapOpen] = useState(false)

  const isStepCompleted = registration?.activeStep > 5

  return (
    <div className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-title">Step 5: Receive GIS Data</h3>
          <p className="text-xs font-semibold text-subtitle mt-0.5">
            {isStepCompleted ? 'Completed' : 'Pending'}
          </p>
        </div>

        <span
          className={cn(
            "px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider",
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          )}
        >
          {isStepCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* QField Submission Received Card */}
      <div className="flex items-center justify-between p-4 bg-blue-50/10 border border-blue-150/20 border-dashed rounded-xl gap-4">
        <div className="flex items-center gap-3">
          {/* Circular Pin Icon */}
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 select-none">
            <MapPin className="w-4 h-4" fill="currentColor" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-emerald-600 block">QField Submission Received</span>
            <span className="text-[10px] font-bold text-slate-500 mt-0.5 block">
              24 GPS points · 3 Jun 2025 14:30
            </span>
          </div>
        </div>

        {/* View on Map Button */}
        <Button
          type="button"
          onClick={() => setMapOpen(true)}
          className='py-2 w-auto'
        >
          View on Map
        </Button>
      </div>

      {/* Map Dialog Popup */}
      {mapOpen && (
        <GISViewMapModal
          isOpen={mapOpen}
          onClose={() => setMapOpen(false)}
          latitude={registration?.latitude || 3.848}
          longitude={registration?.longitude || 11.502}
          parcelName={registration?.parcelName || 'Yaoundé, Bastos'}
          area={Number(registration?.area || 1240)}
          registrationId={registration?.id || 'REG-1203'}
          onConfirm={() => {
            onUpdate({
              latitude: 3.848,
              longitude: 11.502,
              accuracy: 1.2,
              gisUploaded: true,
              gisVerified: true
            })
            setMapOpen(false)
            onCompleteStep()
          }}
        />
      )}
    </div>
  )
}

export default ReceiveGISDataStep