"use client"
import React, { useEffect } from 'react'
import { X, MapPin, Loader2, Pencil, ShieldX, Trash2, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRetrieveParcelDetailsQuery } from '@/redux/features/parcel/parcel.api'
import formatDate from '@/utils/formatDate'

interface ParcelDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  parcelId: number | null
  onEdit: () => void
  onBlock: () => void
  onDelete: () => void
}

const ParcelDetailsModal: React.FC<ParcelDetailsModalProps> = ({
  isOpen,
  onClose,
  parcelId,
  onEdit,
  onBlock,
  onDelete,
}) => {
  const { data: detailsData, isLoading } = useRetrieveParcelDetailsQuery(parcelId!, {
    skip: !parcelId || !isOpen,
  })

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

  const parcel = detailsData?.data

  const cleanNotes = parcel?.notes ? parcel.notes.replace(/<[^>]*>/g, '') : ''

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Sliding Sheet Panel */}
      <div
        className="w-full max-w-md md:max-w-lg bg-white h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex flex-col leading-snug">
            <h2 className="text-base font-extrabold text-slate-900">
              {isLoading ? 'Loading Parcel...' : parcel?.slug || parcel?.parcelCode || `Parcel #${parcelId}`}
            </h2>
            <span className="text-xs font-semibold text-slate-400 mt-0.5">
              {parcel?.location?.city
                ? `${parcel.location.city}${parcel.location.state ? `, ${parcel.location.state}` : ''}`
                : 'Land Parcel Details'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-bold">Fetching parcel details...</span>
          </div>
        ) : parcel ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Topographic Visual Map Header */}
            <div className="relative h-40 bg-emerald-50/70 rounded-xl border border-emerald-100 p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded text-[11px] font-extrabold border shadow-sm',
                    parcel.status === 'PUBLISHED' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                    parcel.status === 'UNDER_VERIFICATION' && 'bg-blue-50 text-blue-600 border-blue-200',
                    parcel.status === 'DRAFT' && 'bg-slate-50 text-slate-600 border-slate-200',
                    parcel.status === 'RESERVED' && 'bg-amber-50 text-amber-600 border-amber-200',
                    parcel.status === 'CLOSED' && 'bg-rose-50 text-rose-600 border-rose-200',
                    parcel.status === 'BLOCKED' && 'bg-red-50 text-red-600 border-red-200'
                  )}
                >
                  {parcel.status}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white border border-emerald-700 shadow-sm">
                  Reliability: {parcel.reliabilityScore ?? 0}%
                </span>
              </div>

              <div className="flex items-center gap-2 z-10">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-xs font-extrabold text-slate-800 truncate">
                  {parcel.location?.addressLine1 || parcel.location?.city || 'Location Pin'}
                  {parcel.location?.country ? `, ${parcel.location.country}` : ''}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Parcel Overview
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Parcel Code</span>
                  <span className="font-extrabold text-slate-800">{parcel.parcelCode || 'N/A'}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Slug</span>
                  <span className="font-extrabold text-slate-800">{parcel.slug || 'N/A'}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Area Size</span>
                  <span className="font-extrabold text-slate-800">{parcel.areaSqm ? `${parcel.areaSqm.toLocaleString()} m²` : 'N/A'}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Price per sqm</span>
                  <span className="font-extrabold text-slate-800">
                    {parcel.pricePerSqm ? `${parcel.pricePerSqm.toLocaleString()} XAF` : 'Not set'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Created Date</span>
                  <span className="font-extrabold text-slate-800">{formatDate(parcel.createdAt)}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Last Updated</span>
                  <span className="font-extrabold text-slate-800">{formatDate(parcel.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Location Details */}
            {parcel.location && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Location Details
                </h3>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Address Line 1</span>
                      <span className="font-extrabold text-slate-800">{parcel.location.addressLine1 || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Address Line 2</span>
                      <span className="font-extrabold text-slate-800">{parcel.location.addressLine2 || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">City / State</span>
                      <span className="font-extrabold text-slate-800">
                        {parcel.location.city ? `${parcel.location.city}, ${parcel.location.state || ''}` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Country / Zip</span>
                      <span className="font-extrabold text-slate-800">
                        {parcel.location.country ? `${parcel.location.country} (${parcel.location.zipCode || ''})` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Coordinates</span>
                      <span className="font-extrabold text-slate-800 font-mono text-[11px]">
                        {parcel.location.latitude ?? 'N/A'}, {parcel.location.longitude ?? 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Remarks</span>
                      <span className="font-extrabold text-slate-800">{parcel.location.remarks || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Owners List */}
            {parcel.owners && parcel.owners.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Parcel Owners ({parcel.owners.length})
                </h3>
                <div className="space-y-2">
                  {parcel.owners.map((owner, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-800 block">
                            {owner.ownerName || 'Unknown Owner'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {owner.ownerPhone || 'No phone'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-extrabold block w-fit ml-auto">
                          {owner.ownershipType || 'PRIMARY'} ({owner.sharePercentage || '0'}%)
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Status: {owner.status || 'PUBLISHED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registration Workflow Linked Info */}
            {parcel.registration && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Linked Registration Record
                </h3>
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-xs grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Registration Slug</span>
                    <span className="font-extrabold text-slate-800">{parcel.registration.slug}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Workflow Step</span>
                    <span className="font-extrabold text-slate-800">Step {parcel.registration.step}/7</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Submission Date</span>
                    <span className="font-extrabold text-slate-800">{formatDate(parcel.registration.submittedAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Registration Status</span>
                    <span className="font-extrabold text-slate-800">{parcel.registration.status}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {cleanNotes && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Notes
                </h3>
                <p className="text-xs font-semibold text-slate-700 bg-slate-50/60 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {cleanNotes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-xs text-slate-400 font-semibold">
            No parcel details found.
          </div>
        )}

        {/* Footer Actions with Edit, Block, Delete */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose()
              onEdit()
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100/60 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              onBlock()
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-100 hover:bg-amber-100/60 rounded-lg transition-colors cursor-pointer"
          >
            <ShieldX className="w-3.5 h-3.5" />
            <span>Block</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              onDelete()
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100/60 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParcelDetailsModal