"use client"
import React, { useEffect, useState } from 'react'
import { X, Building2, User, DollarSign, MessageSquare, ArrowRightLeft, Calendar, MapPin, Loader2 } from 'lucide-react'
import formatDate from '@/utils/formatDate'
import type { PurchaseInterestItem } from '@/redux/features/purchase-interests/purchase-interests.type'
import { Button } from '@/components/ui/button'
import { useGetPurchaseInterestDetailsQuery } from '@/redux/features/purchase-interests/purchase-interests.api'

import ReplyInterestModal from './ReplyInterestModal'
import CreateTransferModal from './CreateTransferModal'

interface PurchaseInterestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  interestId: number | string | null
  initialInterest?: PurchaseInterestItem | null
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending Review', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  ACKNOWLEDGED: { label: 'Acknowledged', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DECLINED: { label: 'Declined', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  MORE_INFO_REQUESTED: { label: 'More Info Requested', className: 'bg-blue-50 text-blue-700 border-blue-200' },
}

export const PurchaseInterestDetailsModal = ({
  isOpen,
  onClose,
  interestId,
  initialInterest,
}: PurchaseInterestDetailsModalProps) => {
  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)

  // API Call to fetch details from /land-purchase-interests/:id
  const { data: detailsRes, isLoading, isFetching } = useGetPurchaseInterestDetailsQuery(
    interestId!,
    { skip: !isOpen || !interestId }
  )

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

  if (!isOpen || !interestId) return null

  const interest: PurchaseInterestItem | undefined = detailsRes?.data || initialInterest || undefined

  const statusConfig = interest?.status
    ? STATUS_BADGES[interest.status] || {
        label: interest.status,
        className: 'bg-slate-50 text-slate-700 border-slate-200',
      }
    : { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200' }

  const formattedOffer = interest?.offerAmount
    ? `${Number(interest.offerAmount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${interest.currency || 'USD'}`
    : 'N/A'

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
                Purchase Interest Details
              </h2>
              {interest?.slug && (
                <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  {interest.slug}
                </span>
              )}
            </div>
            {interest?.createdAt && (
              <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
                Created {formatDate(interest.createdAt)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        {isLoading || isFetching ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 font-semibold text-xs gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-button-color" />
            <span>Loading land purchase interest details...</span>
          </div>
        ) : !interest ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 font-semibold text-xs">
            <span>Failed to load details.</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none text-xs">
            {/* Status & Offer Hero Card */}
            <div className="bg-slate-200 text-white rounded-2xl p-5 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Offer Amount
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${statusConfig.className}`}>
                  {statusConfig.label}
                </span>
              </div>
              <div className="text-2xl font-black tracking-tight text-black  flex items-center gap-1">
                <DollarSign className="w-6 h-6 text-emerald-400 shrink-0" />
                <span>{formattedOffer}</span>
              </div>
            </div>

            {/* Buyer / User Info */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Interested Buyer / Requester
              </span>
              <div className="flex items-center gap-3 bg-slate-50/70 border border-slate-100 rounded-xl p-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-button-color font-extrabold text-xs shrink-0 overflow-hidden border border-white shadow-xs">
                  {interest.user?.profilePicture?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={interest.user.profilePicture.url}
                      alt={interest.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    interest.user?.name?.substring(0, 2).toUpperCase() || 'US'
                  )}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {interest.user?.name || 'System User'}
                  </h3>
                  {interest.user?.phone && (
                    <span className="text-[10px] font-semibold text-slate-500 block truncate">
                      Phone: {interest.user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Target Land Parcel Info */}
            {interest.parcel && (
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Target Land Parcel
                </span>
                <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-button-color" />
                      <span className="text-xs font-bold text-slate-900">
                        {interest.parcel.parcelCode || interest.parcel.slug}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                      {interest.parcel.status || 'PARCEL'}
                    </span>
                  </div>

                  {interest.parcel.location && (
                    <div className="flex items-start gap-1.5 text-slate-600 font-semibold pt-1 border-t border-slate-50">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        {interest.parcel.location.addressLine1}
                        {interest.parcel.location.city && `, ${interest.parcel.location.city}`}
                        {interest.parcel.location.state && `, ${interest.parcel.location.state}`}
                      </span>
                    </div>
                  )}

                  {interest.parcel.areaSqm && (
                    <div className="text-[11px] font-bold text-slate-500">
                      Area: {interest.parcel.areaSqm.toLocaleString()} m²
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Buyer Message / Inquiry Text */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Inquiry Message
              </span>
              <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 text-slate-800 font-semibold leading-relaxed">
                {interest.message ? (
                  <p>{interest.message}</p>
                ) : (
                  <span className="text-slate-400 italic">No custom message provided.</span>
                )}
              </div>
            </div>

            {/* Admin Response Message if Available */}
            {interest.responseMsg && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Official Response Message
                </span>
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 space-y-2 text-slate-800 font-semibold">
                  <p>{interest.responseMsg}</p>
                  {interest.respondedBy && (
                    <div className="text-[10px] text-emerald-700 font-bold pt-2 border-t border-emerald-100 flex items-center justify-between">
                      <span>Responded by: {interest.respondedBy.name}</span>
                      {interest.respondedAt && <span>{formatDate(interest.respondedAt)}</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Button
                onClick={() => setReplyModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <MessageSquare size={15} />
                <span>Reply to Purchase Interest</span>
              </Button>

              <Button
                onClick={() => setTransferModalOpen(true)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 cursor-pointer font-bold border-button-color text-button-color hover:bg-blue-50"
              >
                <ArrowRightLeft size={15} />
                <span>Initiate Land Transfer</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalOpen && interest && (
        <ReplyInterestModal
          isOpen={replyModalOpen}
          onClose={() => setReplyModalOpen(false)}
          interestId={interest.id}
          initialStatus={interest.status}
          initialMessage={interest.responseMsg || ''}
        />
      )}

      {/* Create Transfer Modal */}
      {transferModalOpen && interest && (
        <CreateTransferModal
          isOpen={transferModalOpen}
          onClose={() => setTransferModalOpen(false)}
          initialParcelSlug={interest.parcel?.slug || ''}
          purchaseInterestId={interest.id}
          defaultOfferAmount={interest.offerAmount}
          buyerName={interest.user?.name}
          buyerPhone={interest.user?.phone || ''}
        />
      )}
    </div>
  )
}

export default PurchaseInterestDetailsModal
