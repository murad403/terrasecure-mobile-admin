"use client"
import React, { useState, useEffect } from 'react'
import { X, MapPin, Loader2, CheckCircle2, XCircle, Clock, Building2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import formatDate from '@/utils/formatDate'
import {
  useRetrieveLandConsultationDetailsQuery,
  useAddLandConsultationReplyMutation,
} from '@/redux/features/consultations/consultations.api'
import type { LandConsultationItem } from '@/redux/features/consultations/consultations.type'

interface ConsultationsDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  consultationId: number | string | null
}

const getInitials = (name?: string) => {
  if (!name) return 'US'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const ConsultationsDetailsModal = ({
  isOpen,
  onClose,
  consultationId,
}: ConsultationsDetailsModalProps) => {
  const { data: detailsRes, isLoading: loadingDetails } = useRetrieveLandConsultationDetailsQuery(
    consultationId!,
    { skip: !isOpen || !consultationId }
  )

  const [replyConsultation, { isLoading: isReplying }] = useAddLandConsultationReplyMutation()
  const [responseMsg, setResponseMsg] = useState('')

  const consultation: LandConsultationItem | undefined = detailsRes?.data

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (consultation?.responseMsg) {
        setResponseMsg(consultation.responseMsg)
      } else {
        setResponseMsg('')
      }
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, consultation])

  if (!isOpen) return null

  const handleReplySubmit = async (status: 'ACCEPTED' | 'REJECTED') => {
    if (!consultationId) return

    if (!responseMsg.trim()) {
      toast.warning('Please enter a response message before replying.')
      return
    }

    try {
      const res = await replyConsultation({
        id: consultationId,
        data: {
          responseMsg: responseMsg.trim(),
          status,
        },
      }).unwrap()

      toast.success(res.message || `Consultation ${status.toLowerCase()} successfully!`)
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reply to consultation.')
    }
  }

  const initials = getInitials(consultation?.user?.name)
  const isPending = consultation?.status === 'PENDING'

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white select-none">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold text-slate-900">
              Consultation Details
            </h2>
            {consultation?.slug && (
              <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {consultation.slug}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        {loadingDetails || !consultation ? (
          <div className="flex-1 flex items-center justify-center p-8 text-slate-500 font-semibold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-button-color mr-2" />
            <span>Loading consultation details...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 select-none text-xs">
            {/* Requester Info Box */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Requester Info
              </span>
              <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 rounded-xl p-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center bg-blue-100 text-button-color font-extrabold text-sm shrink-0 overflow-hidden border border-white shadow-sm">
                  {consultation.user?.profilePicture?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={consultation.user.profilePicture.url}
                      alt={consultation.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900">
                    {consultation.user?.name || 'N/A'}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                    <Clock size={11} />
                    <span>Submitted {formatDate(consultation.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requester Location Details Box */}
            {consultation.requesterLocation && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Requester Location</span>
                </div>
                <div className="text-slate-700 text-xs font-semibold pl-6 space-y-0.5">
                  <div>
                    {consultation.requesterLocation.addressLine1}
                    {consultation.requesterLocation.addressLine2 && `, ${consultation.requesterLocation.addressLine2}`}
                  </div>
                  <div>
                    {consultation.requesterLocation.city}, {consultation.requesterLocation.state},{' '}
                    {consultation.requesterLocation.country} {consultation.requesterLocation.zipCode}
                  </div>
                  {consultation.requesterLocation.latitude && (
                    <div className="font-mono text-[11px] text-slate-500 pt-1">
                      GPS: {consultation.requesterLocation.latitude}°N, {consultation.requesterLocation.longitude}°E
                    </div>
                  )}
                  {consultation.requesterLocation.remarks && (
                    <div className="text-[11px] text-slate-500 italic pt-0.5">
                      Remarks: {consultation.requesterLocation.remarks}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Related Parcel Box */}
            {consultation.parcel && (
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Related Land Parcel
                </span>
                <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-blue-600">
                        {consultation.parcel.parcelCode || consultation.parcel.slug}
                      </span>
                    </div>
                    {consultation.parcel.areaSqm && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {consultation.parcel.areaSqm} m²
                      </span>
                    )}
                  </div>
                  {consultation.parcel.location && (
                    <div className="text-[11px] text-slate-500 font-medium">
                      Location: {consultation.parcel.location.addressLine1}, {consultation.parcel.location.city}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Request Message Box */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Request Message
              </span>
              <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 text-slate-700 font-semibold leading-relaxed">
                {consultation.requestMsg}
              </div>
            </div>

            {/* Admin Response Box: Render Input if PENDING, else Render Static Response */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Admin Response
                </span>
                {!isPending && consultation.status && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      consultation.status === 'ACCEPTED'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-rose-50 text-rose-600 border-rose-200'
                    }`}
                  >
                    {consultation.status === 'ACCEPTED' ? (
                      <CheckCircle2 size={10} />
                    ) : (
                      <XCircle size={10} />
                    )}
                    {consultation.status}
                  </span>
                )}
              </div>

              {isPending ? (
                <textarea
                  placeholder="Write your consultation response..."
                  value={responseMsg}
                  onChange={(e) => setResponseMsg(e.target.value)}
                  className="w-full border border-slate-200 bg-white rounded-xl p-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-button-color focus:ring-2 focus:ring-button-color/20 transition-all font-semibold min-h-27.5 leading-relaxed resize-none"
                />
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1">
                  <div className="text-slate-800 font-semibold leading-relaxed">
                    {consultation.responseMsg || 'No response message attached.'}
                  </div>
                  {consultation.respondedAt && (
                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                      Responded at: {formatDate(consultation.respondedAt)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions: ONLY when status is PENDING */}
        {isPending && consultation && (
          <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between gap-3 shrink-0 select-none">
            {/* Accept Button */}
            <Button
              type="button"
              disabled={isReplying}
              onClick={() => handleReplySubmit('ACCEPTED')}
              className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
            >
              {isReplying ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              <span>Accept Consultation</span>
            </Button>

            {/* Reject Button */}
            <button
              type="button"
              disabled={isReplying}
              onClick={() => handleReplySubmit('REJECTED')}
              className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors text-center select-none shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isReplying ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              <span>Reject Consultation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConsultationsDetailsModal