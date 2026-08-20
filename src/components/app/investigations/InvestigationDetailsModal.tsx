"use client"
import React, { useEffect } from 'react'
import { X, MapPin, Loader2, Building2, User, FileText, CheckCircle2, ShieldAlert } from 'lucide-react'
import formatDate from '@/utils/formatDate'
import { useRetrieveLandInvestigationDetailsQuery } from '@/redux/features/investigations/investigations.api'
import { LandInvestigationKind } from '@/enum'
import type { LandInvestigationItem } from '@/redux/features/investigations/investigations.type'

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


const InvestigationDetailsModal = ({
  isOpen,
  onClose,
  investigationId,
}: InvestigationDetailsModalProps) => {
  const { data: detailsRes, isLoading: loadingDetails } =
    useRetrieveLandInvestigationDetailsQuery(investigationId!, {
      skip: !isOpen || !investigationId,
    })

  const investigation: LandInvestigationItem | undefined = detailsRes?.data

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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-120 md:w-130 h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 ease-out border-l border-slate-100 z-50">
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
              className="text-[10px] font-semibold text-slate-400 leading-relaxed max-w-[320px] truncate"
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
          <div className="flex-1 overflow-y-auto p-6 space-y-5 select-none text-xs">
            {/* Kind & Priority Badges */}
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
                      className="group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:border-button-color transition-all block"
                    >
                      {ev.media.type === 'IMAGE' || ev.media.mimeType?.startsWith('image/') ? (
                        <div className="h-28 w-full overflow-hidden bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ev.media.url}
                            alt="Evidence"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="p-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-button-color" />
                          <span className="text-xs font-bold text-slate-700 truncate">
                            Evidence File
                          </span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InvestigationDetailsModal