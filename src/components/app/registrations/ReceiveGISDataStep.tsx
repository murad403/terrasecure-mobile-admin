"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import GISViewMapModal from '@/components/modal/GISViewMapModal'
import type { RegistrationItem } from '@/redux/features/registrations/registration.type'

interface ReceiveGISDataStepProps {
  registration: RegistrationItem
  onNextStep: () => void
}

const ReceiveGISDataStep: React.FC<ReceiveGISDataStepProps> = ({
  registration,
  onNextStep,
}) => {
  const [mapOpen, setMapOpen] = useState(false)
  const isStepCompleted = (registration.step || 1) > 5

  const latestSurvey = registration.surveys?.[0]
  const pointsCount = latestSurvey?.points?.length || 0

  return (
    <div className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Step 5: Receive GIS Data</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {isStepCompleted ? 'Completed' : 'Review Mobile GPS / QField Survey Data'}
          </p>
        </div>

        <span
          className={cn(
            'px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider',
            isStepCompleted
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          )}
        >
          {isStepCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* QField Submission Received Card */}
      {latestSurvey ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-blue-50/30 border border-blue-200 rounded-xl gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-700 block">
                QField Mobile GPS Submission
              </span>
              <span className="text-[11px] font-bold text-slate-600 mt-0.5 block">
                {pointsCount} GPS Points · Area: {latestSurvey.computedAreaSqm || registration.areaSqm || 0} m²
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">
                Status: {latestSurvey.status} · Source: {latestSurvey.source || 'MOBILE_GPS'}
              </span>
            </div>
          </div>

          <Button type="button" onClick={() => setMapOpen(true)} className="w-auto py-2">
            View on Map
          </Button>
        </div>
      ) : (
        <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 font-semibold">
          No GIS survey data submitted yet for this registration.
        </div>
      )}

      {/* Continue Button */}
      <div className="pt-2">
        <Button type="button" onClick={onNextStep} className="w-auto px-6">
          Continue to Next Step
        </Button>
      </div>

      {/* Map Dialog Popup */}
      {mapOpen && (
        <GISViewMapModal
          isOpen={mapOpen}
          onClose={() => setMapOpen(false)}
          registration={registration}
          survey={latestSurvey}
        />
      )}
    </div>
  )
}

export default ReceiveGISDataStep