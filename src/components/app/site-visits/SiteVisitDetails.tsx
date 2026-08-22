"use client"
import React from 'react'
import {
  X,
  Loader2,
  Check,
  Trash2,
  Building2,
  MapPin,
  Calendar,
  User,
  Phone,
  FileText,
  DollarSign,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SiteVisitDetailsProps {
  isOpen: boolean
  onClose: () => void
  visit: any
  isLoading: boolean
  onComplete?: (id: number) => void
  onCancel?: (id: number) => void
  onDelete?: (id: number) => void
  actionLoading?: boolean
}

const getVisitStatus = (visit: any) => {
  if (visit?.cancelledAt) return 'CANCELLED'
  if (visit?.completedAt) return 'COMPLETED'
  return 'SCHEDULED'
}

const formatDateTime = (value?: string | null) => {
  if (!value) return 'N/A'
  const parsed = new Date(value)
  if (isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={cn(
      'px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider block w-fit whitespace-nowrap border',
      status === 'SCHEDULED' && 'bg-indigo-50 text-indigo-700 border-indigo-200',
      status === 'COMPLETED' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
      status === 'CANCELLED' && 'bg-rose-50 text-rose-700 border-rose-200'
    )}
  >
    {status}
  </span>
)

export const SiteVisitDetails = ({
  isOpen,
  onClose,
  visit,
  isLoading,
  onComplete,
  onCancel,
  onDelete,
  actionLoading,
}: SiteVisitDetailsProps) => {
  if (!isOpen) return null

  const status = getVisitStatus(visit)
  const parcel = visit?.parcel
  const registration = visit?.registration
  const location = parcel?.location || registration?.location
  const owners = parcel?.owners || []

  // Clean HTML from notes string if present
  const stripHtml = (html?: string) => {
    if (!html) return ''
    return html.replace(/<[^>]*>?/gm, '').trim()
  }

  return (
    <div
      className="fixed inset-0 z-55 flex justify-end bg-slate-950/60 backdrop-blur-[1.5px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border-l border-slate-200 w-full max-w-md md:max-w-lg h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200 text-slate-800 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 leading-none">
                {visit?.slug || `Site Visit #${visit?.id}`}
              </h2>
              {visit?.kind && (
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                  {visit.kind.replaceAll('_', ' ')}
                </span>
              )}
            </div>
            {!isLoading && visit && <StatusBadge status={status} />}
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-xs font-semibold text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-button-color" />
              <span>Loading site visit details...</span>
            </div>
          ) : visit ? (
            <>
              {/* Scheduled Date Hero Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-1.5 shadow-md">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Scheduled Date & Time
                </span>
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Calendar className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                  <span>{formatDateTime(visit.scheduledAt)}</span>
                </div>
              </div>

              {/* Surveyor Card */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Assigned Surveyor
                </span>
                <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 rounded-xl p-3.5">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-button-color font-extrabold text-xs flex items-center justify-center shrink-0 border border-slate-100">
                    {visit.surveyor?.profilePicture?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={visit.surveyor.profilePicture.url}
                        alt={visit.surveyor.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      visit.surveyor?.name?.substring(0, 2).toUpperCase() || 'SV'
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-bold text-slate-900 text-sm truncate">
                      {visit.surveyor?.name || 'Unassigned'}
                    </span>
                    {(visit.phone || visit.surveyor?.phone) && (
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {visit.phone || visit.surveyor?.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Target Parcel / Registration Info Card */}
              {(parcel || registration) && (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    Land Parcel Information
                  </span>
                  <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-button-color" />
                        <span className="text-xs font-extrabold text-slate-900">
                          {parcel?.slug || parcel?.parcelCode || registration?.slug}
                        </span>
                      </div>
                      {parcel?.status && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                          {parcel.status.replaceAll('_', ' ')}
                        </span>
                      )}
                    </div>

                    {/* Area & Price */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50">
                      {(parcel?.areaSqm || registration?.areaSqm) && (
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-400 block">Total Area</span>
                          <span className="font-extrabold text-slate-800">
                            {(parcel?.areaSqm || registration?.areaSqm).toLocaleString()} m²
                          </span>
                        </div>
                      )}
                      {parcel?.pricePerSqm && (
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-400 block">Price / m²</span>
                          <span className="font-extrabold text-slate-800">
                            ${Number(parcel.pricePerSqm).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Location Address */}
                    {location && (
                      <div className="space-y-1 pt-2 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> Location Address
                        </span>
                        <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                          {location.addressLine1}
                          {location.addressLine2 && `, ${location.addressLine2}`}
                          {location.city && `, ${location.city}`}
                          {location.state && `, ${location.state}`}
                          {location.country && `, ${location.country}`}
                        </p>
                      </div>
                    )}

                    {/* Parcel Description / Notes */}
                    {parcel?.notes && (
                      <div className="space-y-1 pt-2 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-slate-400" /> Description / Notes
                        </span>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {stripHtml(parcel.notes)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Registered Parcel Owners */}
              {owners.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Registered Parcel Owners
                  </span>
                  <div className="space-y-2">
                    {owners.map((ownerItem: any, idx: number) => {
                      const ownerObj = ownerItem.owner
                      return (
                        <div
                          key={idx}
                          className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 flex items-center justify-between"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-xs">
                              {ownerObj?.name || ownerItem.ownerName || `Owner #${idx + 1}`}
                            </span>
                            {ownerObj?.email && (
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {ownerObj.email}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">
                              {ownerItem.ownershipType || 'PRIMARY'}
                            </span>
                            {ownerItem.sharePercentage && (
                              <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                                Share: {ownerItem.sharePercentage}%
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Visit Activity Timestamps
                </span>
                <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3.5 space-y-2 text-slate-600 font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">Created At:</span>
                    <span>{formatDateTime(visit.createdAt)}</span>
                  </div>
                  {visit.completedAt && (
                    <div className="flex justify-between items-center text-emerald-700 font-bold border-t border-slate-100 pt-2">
                      <span>Completed At:</span>
                      <span>{formatDateTime(visit.completedAt)}</span>
                    </div>
                  )}
                  {visit.cancelledAt && (
                    <div className="flex justify-between items-center text-rose-600 font-bold border-t border-slate-100 pt-2">
                      <span>Cancelled At:</span>
                      <span>{formatDateTime(visit.cancelledAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs font-semibold text-slate-400">No details found for this site visit.</p>
          )}
        </div>

        {/* Footer actions */}
        {!isLoading && visit && (
          <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center gap-3 shrink-0 select-none">
            {status === 'SCHEDULED' && onComplete && (
              <Button
                type="button"
                onClick={() => onComplete(visit.id)}
                disabled={actionLoading}
                className="flex-1 py-3 text-xs font-bold cursor-pointer"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Complete Visit
              </Button>
            )}

            {status === 'SCHEDULED' && onCancel && (
              <button
                type="button"
                onClick={() => onCancel(visit.id)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}

            {onDelete && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(visit.id)}
                disabled={actionLoading}
                className="py-3 px-3 text-xs  text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 cursor-pointer font-bold w-auto"
                title="Delete Visit"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SiteVisitDetails
