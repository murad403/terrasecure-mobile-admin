"use client"
import React, { useState, useEffect } from 'react'
import {
  X,
  MapPin,
  Loader2,
  Building2,
  User,
  FileText,
  CheckCircle2,
  Check,
  ChevronRight,
} from 'lucide-react'
import formatDate from '@/utils/formatDate'
import { useRetrieveLandInvestigationDetailsQuery } from '@/redux/features/investigations/investigations.api'
import type { LandInvestigationItem } from '@/redux/features/investigations/investigations.type'
import { LandInvestigationKind } from '@/enum'

import AssignInvestigatorStep from './steps/AssignInvestigatorStep'
import AttachEvidenceStep from './steps/AttachEvidenceStep'
import SubmitFindingsStep from './steps/SubmitFindingsStep'
import FinalizeDecisionStep from './steps/FinalizeDecisionStep'

interface InvestigationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  investigationId: number | string | null
}

const KIND_LABELS: Record<string, string> = Object.keys(LandInvestigationKind).reduce(
  (acc, key) => {
    acc[key] = key.replace(/_/g, ' ')
    return acc
  },
  {} as Record<string, string>
)

export const InvestigationDetailsModal = ({
  isOpen,
  onClose,
  investigationId,
}: InvestigationDetailsModalProps) => {
  const {
    data: detailsRes,
    isLoading: loadingDetails,
    refetch,
  } = useRetrieveLandInvestigationDetailsQuery(investigationId!, {
    skip: !isOpen || !investigationId,
  })

  const investigation: LandInvestigationItem | undefined = detailsRes?.data
  const [activeStepTab, setActiveStepTab] = useState<number>(2)

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

  // Automatically determine active step
  useEffect(() => {
    if (investigation) {
      if (investigation.status === 'CLOSED' || investigation.resolvedAt) {
        setActiveStepTab(5)
      } else if (investigation.findings) {
        setActiveStepTab(5)
      } else if (investigation.evidences && investigation.evidences.length > 0) {
        setActiveStepTab(4)
      } else if (investigation.investigatorId || investigation.investigator) {
        setActiveStepTab(3)
      } else {
        setActiveStepTab(2)
      }
    }
  }, [investigation])

  if (!isOpen) return null

  const isStep2Completed = Boolean(investigation?.investigatorId || investigation?.investigator)
  const isStep3Completed = Boolean(investigation?.evidences && investigation.evidences.length > 0)
  const isStep4Completed = Boolean(investigation?.findings)
  const isStep5Completed = Boolean(investigation?.status === 'CLOSED' || investigation?.resolvedAt)

  const stepsList = [
    { number: 1, title: 'Case Created', isCompleted: true },
    { number: 2, title: 'Assign Investigator', isCompleted: isStep2Completed },
    { number: 3, title: 'Attach Evidence', isCompleted: isStep3Completed },
    { number: 4, title: 'Submit Findings', isCompleted: isStep4Completed },
    { number: 5, title: 'Final Decision', isCompleted: isStep5Completed },
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-125 md:w-140 h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 ease-out border-l border-slate-100 z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="space-y-0.5 select-none">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
                Case Details
              </h2>
              {investigation?.slug && (
                <span className="text-[11px] font-mono font-bold text-red-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                  {investigation.slug}
                </span>
              )}
            </div>
            <p
              className="text-[10px] font-semibold text-slate-400 leading-relaxed max-w-85 truncate"
              title={investigation?.title || ''}
            >
              {investigation?.title || 'Land Dispute Investigation'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        {loadingDetails || !investigation ? (
          <div className="flex-1 flex items-center justify-center p-8 text-slate-500 font-semibold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-button-color mr-2" />
            <span>Loading case details...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none text-xs">
            {/* Kind, Priority & Status Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-900 text-white uppercase tracking-wider">
                {KIND_LABELS[investigation.kind] || investigation.kind}
              </span>
              {investigation.priorityLevel && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200 uppercase tracking-wider">
                  {investigation.priorityLevel} Priority
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                {investigation.status}
              </span>
            </div>

            {/* Requester Info Box */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Requester Info
              </span>
              <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 rounded-xl p-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-button-color font-extrabold text-xs shrink-0 overflow-hidden border border-white shadow-xs">
                  {investigation.requester?.profilePicture?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={investigation.requester.profilePicture.url}
                      alt={investigation.requester.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    investigation.requester?.name?.substring(0, 2).toUpperCase() || 'US'
                  )}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900">
                    {investigation.requester?.name || 'System Admin'}
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-400 block">
                    Created {formatDate(investigation.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Requester Location Box if Present */}
            {investigation.requesterLocation && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Requester Location</span>
                </div>
                <div className="text-slate-700 text-xs font-semibold pl-6 space-y-0.5">
                  <div>
                    {investigation.requesterLocation.addressLine1}
                    {investigation.requesterLocation.addressLine2 &&
                      `, ${investigation.requesterLocation.addressLine2}`}
                  </div>
                  <div>
                    {investigation.requesterLocation.city},{' '}
                    {investigation.requesterLocation.state},{' '}
                    {investigation.requesterLocation.country}{' '}
                    {investigation.requesterLocation.zipCode}
                  </div>
                  {investigation.requesterLocation.latitude && (
                    <div className="font-mono text-[11px] text-slate-500 pt-1">
                      GPS: {investigation.requesterLocation.latitude}°N,{' '}
                      {investigation.requesterLocation.longitude}°E
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Related Disputed Parcel */}
            {investigation.parcel && (
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Related Land Parcel
                </span>
                <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-600">
                      {investigation.parcel.parcelCode || investigation.parcel.slug}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider">
                    Disputed Parcel
                  </span>
                </div>
              </div>
            )}

            {/* Case Description */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Investigation Description
              </span>
              <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 text-slate-700 font-semibold leading-relaxed">
                {investigation.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: investigation.description }}
                    className="prose prose-slate max-w-none text-xs"
                  />
                ) : (
                  'No description attached for this investigation.'
                )}
              </div>
            </div>

            {/* Attached Evidence Media */}
            {investigation.evidences && investigation.evidences.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Attached Evidences ({investigation.evidences.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {investigation.evidences.map((ev) => (
                    <a
                      key={ev.id}
                      href={ev.media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:border-button-color transition-all block p-2"
                    >
                      {ev.media.type === 'IMAGE' || ev.media.mimeType?.startsWith('image/') ? (
                        <div className="h-28 w-full overflow-hidden bg-slate-100 rounded-lg mb-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ev.media.url}
                            alt="Evidence"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="p-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-button-color" />
                          <span className="text-xs font-bold text-slate-700 truncate">
                            Evidence File
                          </span>
                        </div>
                      )}
                      {ev.description && (
                        <div className="text-[10px] text-slate-500 font-medium truncate pt-1">
                          {ev.description}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Investigation Findings if Submitted */}
            {investigation.findings && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Submitted Findings Report
                </span>
                <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 text-slate-800 font-semibold leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{ __html: investigation.findings }}
                    className="prose prose-blue max-w-none text-xs"
                  />
                  {investigation.resolutionNotes && (
                    <div className="mt-3 pt-3 border-t border-blue-100 text-[11px] text-slate-600">
                      <span className="font-bold text-slate-900 block mb-0.5">
                        Resolution Notes:
                      </span>
                      <div
                        dangerouslySetInnerHTML={{ __html: investigation.resolutionNotes }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Workflow Step Indicator Tabs */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Investigation Workflow Steps
              </span>

              <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-xl">
                {stepsList.map((step) => {
                  const isActive = activeStepTab === step.number
                  return (
                    <button
                      key={step.number}
                      type="button"
                      onClick={() => setActiveStepTab(step.number)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all cursor-pointer text-center ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-800 font-medium'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                          step.isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isActive
                            ? 'bg-button-color text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {step.isCompleted ? <Check size={11} strokeWidth={3} /> : step.number}
                      </div>
                      <span className="text-[9px] truncate max-w-full">{step.title}</span>
                    </button>
                  )
                })}
              </div>

              {/* Step Component View */}
              <div className="pt-2">
                {(() => {
                  const currentId = investigation?.id ?? investigationId!
                  return (
                    <>
                      {activeStepTab === 1 && (
                        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          <span>Case created successfully on {formatDate(investigation.createdAt)}.</span>
                        </div>
                      )}

                      {activeStepTab === 2 && (
                        <AssignInvestigatorStep
                          investigationId={currentId}
                          currentInvestigator={investigation.investigator}
                          onSuccess={() => {
                            refetch()
                            setActiveStepTab(3)
                          }}
                        />
                      )}


                      {activeStepTab === 3 && (
                        <AttachEvidenceStep
                          investigationId={currentId}
                          onSuccess={() => {
                            refetch()
                            setActiveStepTab(4)
                          }}
                        />
                      )}

                      {activeStepTab === 4 && (
                        <SubmitFindingsStep
                          investigationId={currentId}
                          initialFindings={investigation.findings || ''}
                          initialResolutionNotes={investigation.resolutionNotes || ''}
                          onSuccess={() => {
                            refetch()
                            setActiveStepTab(5)
                          }}
                        />
                      )}

                      {activeStepTab === 5 && (
                        <FinalizeDecisionStep
                          investigationId={currentId}
                          initialResolutionNotes={investigation.resolutionNotes || ''}
                          onSuccess={() => {
                            refetch()
                          }}
                        />
                      )}
                    </>
                  )
                })()}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InvestigationDetailsModal