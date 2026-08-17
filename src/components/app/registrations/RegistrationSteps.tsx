"use client"
import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { RegistrationItem } from '@/redux/features/registrations/registration.type'

import ReviewSubmissionStep from './ReviewSubmissionStep'
import VerifyDocumentsStep from './VerifyDocumentsStep'
import AssignSurveyorStep from './AssignSurveyorStep'
import ScheduleFieldVisitStep from './ScheduleFieldVisitStep'
import ReceiveGISDataStep from './ReceiveGISDataStep'
import ApproveRejectStep from './ApproveRejectStep'
import PublishParcelStep from './PublishParcelStep'

interface RegistrationStepsProps {
  isOpen: boolean
  onClose: () => void
  registrationId: number
  registration?: RegistrationItem
  isLoadingDetails?: boolean
}

const STEP_LABELS = [
  'Review Submission',
  'Verify Documents',
  'Assign Surveyor',
  'Schedule Field Visit',
  'Receive GIS Data',
  'Verify GIS Data',
  'Publish Parcel',
]

const RegistrationSteps: React.FC<RegistrationStepsProps> = ({
  isOpen,
  onClose,
  registrationId,
  registration,
  isLoadingDetails,
}) => {
  const [currentViewStep, setCurrentViewStep] = useState<number>(1)

  useEffect(() => {
    if (registration?.step) {
      setCurrentViewStep(registration.step)
    }
  }, [registration?.id, registration?.step])

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

  const activeStepNum = registration?.step || 1
  const primaryOwner = registration?.registrants?.[0]?.ownerName || 'N/A'
  const locationText = registration?.location
    ? `${registration.location.city || ''} ${registration.location.state ? `, ${registration.location.state}` : ''}`.trim()
    : 'N/A'

  const initials = primaryOwner
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const handleNext = () => {
    if (currentViewStep < 7) {
      setCurrentViewStep(currentViewStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentViewStep > 1) {
      setCurrentViewStep(currentViewStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full sm:w-125 md:w-140 h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100 z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Registration {registration?.slug || `REG-${registrationId}`}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {primaryOwner} · {locationText}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Applicant Profile Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/20 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
              {initials}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{primaryOwner}</h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Area: {registration?.areaSqm || 'N/A'} m² · {locationText}
              </p>
            </div>
          </div>
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap block w-fit shadow-sm uppercase tracking-wider',
              (registration?.status === 'PUBLISHED' || registration?.status === 'CONVERTED') &&
                'bg-emerald-50 text-emerald-600 border-emerald-100',
              (registration?.status === 'UNDER_VERIFICATION' || registration?.status === 'In Progress') &&
                'bg-blue-50 text-blue-600 border-blue-200',
              (registration?.status === 'DRAFT' || registration?.status === 'Pending') &&
                'bg-amber-50 text-amber-600 border-amber-100',
              (registration?.status === 'CLOSED' || registration?.status === 'REJECTED') &&
                'bg-rose-50 text-rose-600 border-rose-100'
            )}
          >
            {registration?.status || 'DRAFT'}
          </span>
        </div>

        {/* Stepper Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 bg-white select-none">
          <div className="relative flex items-center justify-between w-full">
            <div className="absolute left-6 right-6 top-3 h-0.5 bg-slate-200 -z-10" />
            <div
              className="absolute left-6 top-3 h-0.5 bg-blue-600 transition-all duration-300 -z-10"
              style={{ width: `${((activeStepNum - 1) / 6) * 100}%` }}
            />

            {STEP_LABELS.map((label, index) => {
              const stepNum = index + 1
              const isCompleted = stepNum < activeStepNum
              const isActive = stepNum === activeStepNum
              const isViewing = stepNum === currentViewStep

              return (
                <div
                  key={label}
                  className="flex flex-col items-center select-none cursor-pointer flex-1"
                  onClick={() => setCurrentViewStep(stepNum)}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border-2 select-none shadow-sm',
                      isViewing
                        ? 'border-button-color bg-button-color text-white ring-4 ring-button-color/20'
                        : isCompleted
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : isActive
                        ? 'border-amber-500 bg-amber-500 text-white'
                        : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                    )}
                  >
                    {isCompleted ? <Check className="w-3 h-3 stroke-3" /> : stepNum}
                  </div>
                  <span
                    className={cn(
                      'text-[8px] font-bold mt-1.5 uppercase tracking-wide text-center leading-tight block',
                      isViewing
                        ? 'text-button-color font-extrabold'
                        : isCompleted
                        ? 'text-blue-600'
                        : isActive
                        ? 'text-amber-500 font-bold'
                        : 'text-slate-400'
                    )}
                  >
                    {label.split(' ').map((w, idx) => (
                      <span key={idx} className="block">
                        {w}
                      </span>
                    ))}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoadingDetails ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-button-color" />
              <span className="text-xs font-semibold">Loading registration details...</span>
            </div>
          ) : (
            registration && (
              <>
                {currentViewStep === 1 && (
                  <ReviewSubmissionStep
                    registration={registration}
                    onNextStep={handleNext}
                  />
                )}

                {currentViewStep === 2 && (
                  <VerifyDocumentsStep
                    registration={registration}
                    onNextStep={handleNext}
                  />
                )}

                {currentViewStep === 3 && (
                  <AssignSurveyorStep
                    registration={registration}
                    onNextStep={handleNext}
                  />
                )}

                {currentViewStep === 4 && (
                  <ScheduleFieldVisitStep
                    registration={registration}
                    onNextStep={handleNext}
                  />
                )}

                {currentViewStep === 5 && (
                  <ReceiveGISDataStep
                    registration={registration}
                    onNextStep={handleNext}
                  />
                )}

                {currentViewStep === 6 && (
                  <ApproveRejectStep
                    registration={registration}
                    onNextStep={handleNext}
                  />
                )}

                {currentViewStep === 7 && (
                  <PublishParcelStep
                    registration={registration}
                    onCloseDrawer={onClose}
                  />
                )}
              </>
            )
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 p-6 bg-slate-50/50 mt-auto select-none shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentViewStep === 1}
            className="w-auto px-4 py-2 border-slate-200 select-none cursor-pointer flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1 shrink-0" /> Previous Step
          </Button>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest select-none">
            Step {currentViewStep} of 7
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentViewStep === 7}
            className="w-auto px-4 py-2 border-slate-200 select-none cursor-pointer flex items-center"
          >
            Next Step <ChevronRight className="w-4 h-4 ml-1 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RegistrationSteps
export { STEP_LABELS }