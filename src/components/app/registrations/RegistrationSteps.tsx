"use client"
import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Import all step components
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
    registration: any
    onUpdateRegistration: (id: string, updatedFields: any) => void
}

const STEP_LABELS = [
    'Review Submission',
    'Verify Documnts',
    'Assign Surveyor',
    'Schedule Field Visit',
    'Receive GIS Data',
    'Approve / Reject',
    'Publish Parcel'
]

const RegistrationSteps = ({ isOpen, onClose, registration, onUpdateRegistration }: RegistrationStepsProps) => {
    // Track which step the user is currently viewing in the drawer
    const [currentViewStep, setCurrentViewStep] = useState(1)

    // Sync currentViewStep to the registration's active step when it changes/opens
    useEffect(() => {
        if (registration) {
            setCurrentViewStep(registration.activeStep || 1)
        }
    }, [registration.id])

    // Lock scroll when open
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

    if (!isOpen || !registration) return null

    const handleUpdate = (updatedFields: any) => {
        onUpdateRegistration(registration.id, updatedFields)
    }

    // Action callback when a step is completed successfully (via its local submit button)
    const handleCompleteStep = () => {
        const nextStep = registration.activeStep + 1
        const finalFields: any = {}

        if (registration.activeStep < 7) {
            finalFields.activeStep = nextStep

            // Update human-readable status automatically based on step completion
            if (nextStep === 2) finalFields.status = 'Pending'
            else if (nextStep === 3) finalFields.status = 'In Progress'
            else if (nextStep === 4) finalFields.status = 'In Progress'
            else if (nextStep === 5) finalFields.status = 'In Progress'
            else if (nextStep === 6) finalFields.status = 'In Progress'
            else if (nextStep === 7) finalFields.status = 'In Progress'

            // Advance viewed step as well
            setCurrentViewStep(nextStep)
        }

        onUpdateRegistration(registration.id, finalFields)
    }

    // Footer Navigation Handlers
    const handlePrev = () => {
        if (currentViewStep > 1) {
            setCurrentViewStep(currentViewStep - 1)
        }
    }

    const handleNext = () => {
        if (currentViewStep < 7) {
            setCurrentViewStep(currentViewStep + 1)
        }
    }

    const initials = registration.ownerName
        ? registration.ownerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : 'PM'

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
                onClick={onClose}
            />

            {/* Slide-out Drawer Panel */}
            <div className="relative w-full sm:w-[500px] md:w-[560px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-350 ease-out border-l border-slate-100 z-50">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                    <div>
                        <h2 className="text-sm font-bold text-title">
                            Registration {registration.id}
                        </h2>
                        <p className="text-xs font-semibold text-subtitle mt-0.5">
                            {registration.ownerName} · {registration.city}, {registration.district}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Applicant Profile card */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/20 select-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                            {initials}
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-title">{registration.ownerName}</h3>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                Submitted {registration.createdDate} · {registration.city}, {registration.district}
                            </p>
                        </div>
                    </div>
                    <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap block w-fit shadow-sm uppercase tracking-wider",
                        registration.status === 'Completed' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                        registration.status === 'In Progress' && 'bg-blue-50 text-blue-600 border-blue-200',
                        registration.status === 'Pending' && 'bg-amber-50 text-amber-600 border-amber-100',
                        registration.status === 'Rejected' && 'bg-rose-50 text-rose-600 border-rose-100'
                    )}>
                        {registration.status}
                    </span>
                </div>

                {/* Stepper Section (Horizontal circles) */}
                <div className="px-6 py-5 border-b border-slate-100 bg-white select-none">
                    <div className="relative flex items-center justify-between w-full">

                        {/* Stepper Line Background */}
                        <div className="absolute left-6 right-6 top-3 h-0.5 bg-slate-200 -z-10" />

                        {/* Stepper Line Active Progress */}
                        <div
                            className="absolute left-6 top-3 h-0.5 bg-blue-600 transition-all duration-300 -z-10"
                            style={{ width: `${((registration.activeStep - 1) / 6) * 100}%` }}
                        />

                        {/* Steps */}
                        {STEP_LABELS.map((label, index) => {
                            const stepNum = index + 1
                            const isCompleted = stepNum < registration.activeStep
                            const isActive = stepNum === registration.activeStep
                            const isViewing = stepNum === currentViewStep

                            return (
                                <div key={label} className="flex flex-col items-center select-none cursor-pointer flex-1" onClick={() => setCurrentViewStep(stepNum)}>
                                    <div
                                        className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border-2 select-none shadow-sm",
                                            isViewing
                                                ? "border-button-color bg-button-color text-white ring-4 ring-button-color/20"
                                                : isCompleted
                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                    : isActive
                                                        ? "border-amber-500 bg-amber-500 text-white"
                                                        : "border-slate-200 bg-white text-slate-400 hover:border-slate-350"
                                        )}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-3 h-3 stroke-3" />
                                        ) : (
                                            stepNum
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[8px] font-bold mt-1.5 uppercase tracking-wide text-center leading-tight block",
                                            isViewing
                                                ? "text-button-color font-extrabold"
                                                : isCompleted
                                                    ? "text-blue-600"
                                                    : isActive
                                                        ? "text-amber-500 font-bold"
                                                        : "text-slate-400"
                                        )}
                                    >
                                        {label.split(' ').map((w, idx) => (
                                            <span key={idx} className="block">{w}</span>
                                        ))}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Step Body Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {currentViewStep === 1 && (
                        <ReviewSubmissionStep
                            registration={registration}
                            onUpdate={handleUpdate}
                            onCompleteStep={handleCompleteStep}
                        />
                    )}

                    {currentViewStep === 2 && (
                        <VerifyDocumentsStep
                            registration={registration}
                            onUpdate={handleUpdate}
                            onCompleteStep={handleCompleteStep}
                        />
                    )}

                    {currentViewStep === 3 && (
                        <AssignSurveyorStep
                            registration={registration}
                            onUpdate={handleUpdate}
                            onCompleteStep={handleCompleteStep}
                        />
                    )}

                    {currentViewStep === 4 && (
                        <ScheduleFieldVisitStep
                            registration={registration}
                            onUpdate={handleUpdate}
                            onCompleteStep={handleCompleteStep}
                        />
                    )}

                    {currentViewStep === 5 && (
                        <ReceiveGISDataStep
                            registration={registration}
                            onUpdate={handleUpdate}
                            onCompleteStep={handleCompleteStep}
                        />
                    )}

                    {currentViewStep === 6 && (
                        <ApproveRejectStep
                            registration={registration}
                            onUpdate={handleUpdate}
                            onCompleteStep={handleCompleteStep}
                        />
                    )}

                    {currentViewStep === 7 && (
                        <PublishParcelStep
                            registration={registration}
                            onUpdate={handleUpdate}
                            onCompleteStep={handleCompleteStep}
                        />
                    )}
                </div>

                {/* Previous and Next Navigation Footer */}
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

                    <span className="text-[11px] font-bold text-slate-450 uppercase tracking-widest text-slate-400 select-none">
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